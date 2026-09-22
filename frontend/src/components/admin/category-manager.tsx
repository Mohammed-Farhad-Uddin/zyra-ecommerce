'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SmartImage } from '@/components/ui/smart-image';
import { useToast } from '@/components/ui/toast';
import type { CategoryDTO } from '@aurelia/backend/shared';

type Draft = { name: string; description: string; imageUrl: string };

const emptyDraft: Draft = { name: '', description: '', imageUrl: '' };

export function CategoryManager({ categories }: { categories: CategoryDTO[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || creating) return;

    setCreating(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, position: categories.length + 1 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not create the category');

      setDraft(emptyDraft);
      toast({ title: 'Category created', description: data.name });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Could not create category',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    } finally {
      setCreating(false);
    }
  }

  async function save(id: string) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not update the category');

      setEditingId(null);
      toast({ title: 'Category updated' });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(category: CategoryDTO) {
    if (!confirm(`Delete the “${category.name}” category?`)) return;

    setBusyId(category.id);
    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not delete the category');

      toast({ title: 'Category deleted' });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : undefined,
        variant: 'error',
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="card overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory">
              <Tags className="h-6 w-6 text-gold-400" />
            </span>
            <h2 className="mt-5 font-serif text-2xl text-charcoal-900">No categories yet</h2>
            <p className="mt-2 max-w-xs text-sm text-charcoal-400">
              Add your first category — for example Rings or Necklaces.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sand">
            <AnimatePresence initial={false}>
              {categories.map((category) => {
                const editing = editingId === category.id;
                const busy = busyId === category.id;

                return (
                  <motion.div key={category.id} layout exit={{ opacity: 0, height: 0 }}>
                    {editing ? (
                      <div className="space-y-3 bg-ivory/60 p-5">
                        <input
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          placeholder="Category name"
                          className="input"
                        />
                        <input
                          value={editDraft.description}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, description: e.target.value })
                          }
                          placeholder="Short description"
                          className="input"
                        />
                        <input
                          value={editDraft.imageUrl}
                          onChange={(e) => setEditDraft({ ...editDraft, imageUrl: e.target.value })}
                          placeholder="Image URL"
                          className="input"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => save(category.id)}
                            disabled={busy}
                            className="btn-primary px-5 py-2.5"
                          >
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="btn-outline px-5 py-2.5"
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 sm:px-5">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ivory">
                          <SmartImage
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-charcoal-900">{category.name}</p>
                          <p className="truncate text-xs text-charcoal-400">
                            {category.description || `/${category.slug}`}
                          </p>
                        </div>

                        <span className="hidden shrink-0 rounded-full bg-ivory px-3 py-1 text-xs text-charcoal-400 sm:inline">
                          {category.productCount} product(s)
                        </span>

                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(category.id);
                              setEditDraft({
                                name: category.name,
                                description: category.description ?? '',
                                imageUrl: category.imageUrl ?? '',
                              });
                            }}
                            aria-label={`Edit ${category.name}`}
                            className="rounded-full p-2 text-charcoal-400 transition hover:bg-ivory hover:text-charcoal-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(category)}
                            disabled={busy}
                            aria-label={`Delete ${category.name}`}
                            className="rounded-full p-2 text-charcoal-400 transition hover:bg-rose-50 hover:text-rose-500"
                          >
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <form onSubmit={create} className="card h-fit p-6 xl:sticky xl:top-6">
        <h2 className="font-serif text-xl text-charcoal-900">Add a category</h2>
        <p className="mt-1 text-xs text-charcoal-400">
          Categories appear in the navigation and on the homepage.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="new-name">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="new-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Anklets"
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="new-description">
              Description
            </label>
            <input
              id="new-description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Fine chains for summer"
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="new-image">
              Image URL
            </label>
            <input
              id="new-image"
              value={draft.imageUrl}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              placeholder="https://…"
              className="input"
            />
          </div>
        </div>

        <button type="submit" disabled={creating} className="btn-primary mt-6 w-full">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add category
        </button>
      </form>
    </div>
  );
}
