"use client";

import {
  User,
  Users,
  Building2,
  Factory,
  Globe,
  CalendarDays,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CompanyOverviewProps {
  /** Full company description */
  description?: string;
  /** Name of the CEO */
  ceo?: string;
  /** Number of full-time employees */
  fullTimeEmployees?: number;
  /** Business sector */
  sector?: string;
  /** Industry classification */
  industry?: string;
  /** Stock exchange */
  exchange?: string;
  /** Company website URL */
  website?: string;
  /** IPO date string */
  ipoDate?: string;
  /** Additional CSS classes */
  className?: string;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value || "--"}</p>
      </div>
    </div>
  );
}

export function CompanyOverview({
  description,
  ceo,
  fullTimeEmployees,
  sector,
  industry,
  exchange,
  website,
  ipoDate,
  className,
}: CompanyOverviewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Description */}
      {description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Info Grid */}
      <div>
        <h3 className="mb-4 text-base font-semibold">Company Information</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <InfoItem
            icon={<User className="size-4" />}
            label="CEO"
            value={ceo}
          />
          <InfoItem
            icon={<Users className="size-4" />}
            label="Employees"
            value={
              fullTimeEmployees != null
                ? fullTimeEmployees.toLocaleString()
                : undefined
            }
          />
          <InfoItem
            icon={<Building2 className="size-4" />}
            label="Sector"
            value={sector}
          />
          <InfoItem
            icon={<Factory className="size-4" />}
            label="Industry"
            value={industry}
          />
          <InfoItem
            icon={<Landmark className="size-4" />}
            label="Exchange"
            value={exchange}
          />
          <InfoItem
            icon={<Globe className="size-4" />}
            label="Website"
            value={website}
          />
          <InfoItem
            icon={<CalendarDays className="size-4" />}
            label="IPO Date"
            value={ipoDate}
          />
        </div>
      </div>
    </div>
  );
}
