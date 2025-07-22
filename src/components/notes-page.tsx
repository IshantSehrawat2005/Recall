"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles, MoreHorizontal, Star, StarOff, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Command, CommandInput, CommandList, CommandItem } from "./ui/command";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
}

export default function NotesPage({ user }: { user?: any }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tab, setTab] = useState("all");

  // Add a new note
  const addNote = () => {
    if (!title.trim() && !content.trim()) return;
    setNotes([
      ...notes,
      {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        favorite: false,
      },
    ]);
    setTitle("");
    setContent("");
    setTags([]);
  };

  // Delete a note
  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Start editing a note
  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags);
  };

  // Save edited note
  const saveEdit = (id: number) => {
    setNotes(notes.map((note) =>
      note.id === id
        ? { ...note, title: editTitle, content: editContent, tags: editTags }
        : note
    ));
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditTags([]);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditTags([]);
  };

  // Add tag to new note
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Add tag to editing note
  const addEditTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag from new note
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Remove tag from editing note
  const removeEditTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    setNotes(notes.map((note) =>
      note.id === id ? { ...note, favorite: !note.favorite } : note
    ));
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    if (tab === "favorites" && !note.favorite) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        note.title.toLowerCase().includes(s) ||
        note.content.toLowerCase().includes(s) ||
        note.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return true;
  });

  return (
    <div className="flex min-h-[80vh] w-full max-w-7xl mx-auto py-8 gap-8">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-card border rounded-xl shadow h-fit p-4 gap-4">
        <h2 className="font-bold text-lg mb-2">Notes</h2>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="w-1/2">All</TabsTrigger>
            <TabsTrigger value="favorites" className="w-1/2">Favorites</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4">
          <Command>
            <CommandInput placeholder="Search notes..." value={search} onValueChange={setSearch} />
          </Command>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6">
        <Card className="mb-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Plus className="w-6 h-6 text-primary" /> Create a Note
            </CardTitle>
            <Button size="icon" variant="ghost" title="AI Generate (Hugging Face)">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Content (Markdown supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} <span className="ml-1">×</span>
                </Badge>
              ))}
              <Input
                className="w-24"
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTag();
                }}
              />
              <Button size="sm" variant="outline" onClick={addTag}>Add</Button>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={addNote} className="rounded-full flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Note
            </Button>
          </CardFooter>
        </Card>
        <ScrollArea className="flex-1">
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6 [column-fill:_balance]">
            {filteredNotes.length === 0 && (
              <div className="col-span-2 text-muted-foreground text-center py-12">No notes found.</div>
            )}
            {filteredNotes.map((note) => (
              <Card key={note.id} className="relative group break-inside-avoid mb-6 border border-border bg-background/80 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 px-4 pt-4">
                  <div className="flex items-center gap-2 flex-1">
                    {editingId === note.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="font-semibold text-lg bg-transparent border-none px-0"
                      />
                    ) : (
                      <CardTitle className="font-semibold text-lg cursor-pointer" onClick={() => startEdit(note)}>
                        {note.title || "Untitled"}
                      </CardTitle>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant={note.favorite ? "secondary" : "ghost"}
                      className="ml-1"
                      onClick={() => toggleFavorite(note.id)}
                      title={note.favorite ? "Unfavorite" : "Favorite"}
                    >
                      {note.favorite ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-1"
                      title="AI (Hugging Face)"
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-1"
                      title="More"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 px-4">
                  {editingId === note.id ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="bg-transparent border-none px-0"
                    />
                  ) : (
                    <div className="whitespace-pre-line text-sm min-h-[48px] text-foreground/90">{note.content}</div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 justify-between items-center px-4 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {(editingId === note.id ? editTags : note.tags).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={editingId === note.id ? () => removeEditTag(tag) : undefined}
                      >
                        {tag} {editingId === note.id && <span className="ml-1">×</span>}
                      </Badge>
                    ))}
                    {editingId === note.id && (
                      <Input
                        className="w-20"
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addEditTag();
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingId === note.id ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => saveEdit(note.id)}><Edit className="w-4 h-4 mr-1" />Save</Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEdit(note)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteNote(note.id)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                      </>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
