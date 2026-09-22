'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Link2, Loader2, Star, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { SmartImage } from '@/components/ui/smart-image';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export type EditableImage = { url: string; isPrimary: boolean };

export function ImageUploader({
  images,
  onChange,
}: {
  images: EditableImage[];
  onChange: (images: EditableImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  function append(urls: string[]) {
    const additions = urls.map((url) => ({ url, isPrimary: false }));
    const next = [...images, ...additions];
    // The first image added becomes the cover until the owner picks another.
    if (!next.some((image) => image.isPrimary) && next.length > 0) next[0].isPrimary = true;
    onChange(next);
  }

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      list.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Upload failed');

      append(data.urls as string[]);
      toast({ title: `${data.urls.length} image(s) uploaded` });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
      toast({ title: 'Enter a full image URL starting with https://', variant: 'error' });
      return;
    }
    append([url]);
    setUrlInput('');
  }

  function remove(index: number) {
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((image) => image.isPrimary)) next[0].isPrimary = true;
    onChange(next);
  }

  function setPrimary(index: number) {
    onChange(images.map((image, i) => ({ ...image, isPrimary: i === index })));
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition',
          dragging ? 'border-gold-400 bg-gold-100/40' : 'border-sand bg-ivory/60 hover:border-gold-300',
        )}
      >
        {uploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-gold-500" />
        ) : (
          <UploadCloud className="h-7 w-7 text-gold-500" />
        )}
        <p className="mt-3 text-sm font-medium text-charcoal-900">
          {uploading ? 'Uploading…' : 'Drop images here or click to browse'}
        </p>
        <p className="mt-1 text-xs text-charcoal-400">
          JPG, PNG, WebP or AVIF · up to 6 MB each · multiple files supported
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && void upload(e.target.files)}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image URL"
            className="input pl-10"
          />
        </div>
        <button type="button" onClick={addUrl} className="btn-outline shrink-0 px-5 py-2.5">
          <ImagePlus className="h-4 w-4" />
          Add
        </button>
      </div>

      {images.length > 0 ? (
        <>
          <p className="text-xs text-charcoal-400">
            Click the star to choose the display / cover image shown on listings.
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            <AnimatePresence initial={false}>
              {images.map((image, index) => (
                <motion.div
                  key={`${image.url}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-xl border-2 bg-ivory',
                    image.isPrimary ? 'border-gold-400' : 'border-transparent',
                  )}
                >
                  <SmartImage
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />

                  {image.isPrimary ? (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-gold-400 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white">
                      Cover
                    </span>
                  ) : null}

                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-gradient-to-t from-charcoal-900/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      aria-label="Set as cover image"
                      className="rounded-full bg-white/90 p-1.5 text-charcoal-800 transition hover:bg-gold-400 hover:text-white"
                    >
                      <Star className={cn('h-3.5 w-3.5', image.isPrimary && 'fill-current')} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label="Remove image"
                      className="rounded-full bg-white/90 p-1.5 text-charcoal-800 transition hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : null}
    </div>
  );
}
