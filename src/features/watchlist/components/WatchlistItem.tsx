"use client";

import * as React from "react";
import Link from "next/link";
import { Trash2, Pencil, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WatchlistItemData {
  /** Unique ID of the watchlist entry */
  id: string;
  /** Ticker symbol */
  symbol: string;
  /** Full company name */
  companyName: string;
  /** User notes */
  notes?: string;
}

interface WatchlistItemProps {
  /** Watchlist item data */
  item: WatchlistItemData;
  /** Callback when notes are updated */
  onNotesUpdate?: (id: string, notes: string) => void;
  /** Callback when item is removed */
  onRemove?: (id: string) => void;
  /** Additional CSS classes */
  className?: string;
}

export function WatchlistItem({
  item,
  onNotesUpdate,
  onRemove,
  className,
}: WatchlistItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [notesValue, setNotesValue] = React.useState(item.notes ?? "");

  function handleSaveNotes() {
    onNotesUpdate?.(item.id, notesValue);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setNotesValue(item.notes ?? "");
    setIsEditing(false);
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/company/${encodeURIComponent(item.symbol)}`}
              className="group"
            >
              <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary">
                <Badge variant="outline" className="font-mono text-xs shrink-0">
                  {item.symbol}
                </Badge>
                <span className="truncate">{item.companyName}</span>
              </CardTitle>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsEditing(!isEditing)}
              aria-label="Edit notes"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onRemove?.(item.id)}
              aria-label={`Remove ${item.symbol} from watchlist`}
              className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Add your notes about this company..."
              className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button size="xs" onClick={handleSaveNotes}>
                <Check className="mr-1 size-3" />
                Save
              </Button>
              <Button size="xs" variant="ghost" onClick={handleCancelEdit}>
                <X className="mr-1 size-3" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.notes || "No notes yet. Click the pencil icon to add some."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
