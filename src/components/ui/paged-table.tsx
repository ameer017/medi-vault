"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function PagedTable({
  header,
  rows,
  className,
}: {
  header: ReactNode;
  rows: ReactNode[];
  className?: string;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visible = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [currentPage, rows]);

  const from = rows.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, rows.length);

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="no-scrollbar max-h-[min(36rem,calc(100vh-20rem))] overflow-auto rounded-2xl border border-[var(--line)]">
        <Table>
          <thead className="sticky top-0 z-10">{header}</thead>
          <tbody>{visible}</tbody>
        </Table>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted)]">
        <p>
          {from}–{to} of {rows.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setPage(Math.max(1, currentPage - 1))}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
