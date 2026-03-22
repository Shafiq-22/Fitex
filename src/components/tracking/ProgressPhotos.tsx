import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useProfile } from '../../contexts/ProfileContext';
import { generateId } from '../../lib/id';
import { savePhoto, getPhotos, deletePhoto, countPhotos } from '../../lib/db';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { EmptyState } from '../ui/EmptyState';

interface PhotoDisplay {
  id: string;
  date: string;
  label?: string;
  dataUrl: string;
}

const MAX_PHOTOS = 30;

export function ProgressPhotos() {
  const { activeProfile } = useProfile();
  const profileId = activeProfile?.id ?? '';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoDisplay[]>([]);
  const [count, setCount] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoDisplay | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, [profileId]);

  async function loadPhotos() {
    if (!profileId) return;
    setLoading(true);
    try {
      const records = await getPhotos(profileId);
      const total = await countPhotos(profileId);
      setCount(total);
      const displays: PhotoDisplay[] = await Promise.all(
        records.map(async (r) => {
          const url = await blobToDataUrl(r.thumbnail || r.blob);
          return { id: r.id, date: r.date, label: r.label, dataUrl: url };
        })
      );
      displays.sort((a, b) => b.date.localeCompare(a.date));
      setPhotos(displays);
    } catch {
      // silently handle
    }
    setLoading(false);
  }

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || count >= MAX_PHOTOS) return;

    const id = generateId();
    const date = format(new Date(), 'yyyy-MM-dd');

    await savePhoto({
      id,
      profileId,
      date,
      blob: file,
    });

    await loadPhotos();
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deletePhoto(deleteId);
    setDeleteId(null);
    setSelectedPhoto(null);
    await loadPhotos();
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Progress Photos
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {count}/{MAX_PHOTOS}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mb-4"
          disabled={count >= MAX_PHOTOS}
        >
          Take Photo
        </Button>

        {photos.length === 0 ? (
          <EmptyState
            icon="📷"
            title="No photos yet"
            description="Take your first progress photo to track your visual transformation."
          />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group"
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.label || 'Progress photo'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-1.5">
                  <span className="text-[10px] text-white">
                    {format(new Date(photo.date), 'MMM d')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Full-screen viewer */}
      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)}>
        {selectedPhoto && (
          <div className="space-y-4">
            <img
              src={selectedPhoto.dataUrl}
              alt={selectedPhoto.label || 'Progress photo'}
              className="w-full rounded-xl"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              {format(new Date(selectedPhoto.date), 'MMMM d, yyyy')}
            </p>
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setDeleteId(selectedPhoto.id)}
            >
              Delete Photo
            </Button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message="Are you sure you want to delete this photo? This cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
