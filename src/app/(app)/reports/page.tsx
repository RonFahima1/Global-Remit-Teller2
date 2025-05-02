"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  generateReport,
  exportReport,
  downloadReport,
  type ReportFilter,
  type ReportData,
} from "@/services/reports";
import { BarChart, PieChart } from "@/components/ui/chart";

type ChartData = {
  name: string;
  value: number;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { t } = useTranslation();
  const { register, handleSubmit, watch } = useForm<ReportFilter>();

  const onSubmit = async (data: ReportFilter) => {
    setLoading(true);
    try {
      const report = await generateReport(data);
      setReportData(report);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    if (!reportData) return;

    try {
      const blob = await exportReport(reportData, format);
      const filename = `report-${format(new Date(), "yyyy-MM-dd")}.${format}`;
      downloadReport(blob, filename);
    } catch (error) {
      console.error("Failed to export report:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("reports.title")}
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {t("reports.description")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            disabled={!reportData}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("reports.exportCsv")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={!reportData}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("reports.exportPdf")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("reports.filters")}</CardTitle>
          <CardDescription>{t("reports.filtersDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("reports.startDate")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watch("startDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch("startDate") ? (
                        format(watch("startDate") as Date, "PPP")
                      ) : (
                        <span>{t("reports.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch("startDate")}
                      onSelect={(date) =>
                        register("startDate").onChange({
                          target: { value: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("reports.endDate")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watch("endDate") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch("endDate") ? (
                        format(watch("endDate") as Date, "PPP")
                      ) : (
                        <span>{t("reports.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch("endDate")}
                      onSelect={(date) =>
                        register("endDate").onChange({
                          target: { value: date },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("reports.type")}
                </label>
                <Select
                  onValueChange={(value) =>
                    register("type").onChange({
                      target: { value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("reports.allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send">{t("reports.typeSend")}</SelectItem>
                    <SelectItem value="receive">
                      {t("reports.typeReceive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("reports.status")}
                </label>
                <Select
                  onValueChange={(value) =>
                    register("status").onChange({
                      target: { value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("reports.allStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">
                      {t("reports.statusCompleted")}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t("reports.statusPending")}
                    </SelectItem>
                    <SelectItem value="failed">
                      {t("reports.statusFailed")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("reports.generate")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {reportData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("reports.summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("reports.totalTransactions")}
                  </dt>
                  <dd className="text-2xl font-bold">
                    {reportData.totalTransactions}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("reports.totalAmount")}
                  </dt>
                  <dd className="text-2xl font-bold">
                    ${reportData.totalAmount.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("reports.averageAmount")}
                  </dt>
                  <dd className="text-2xl font-bold">
                    ${reportData.averageAmount.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>{t("reports.dailyTransactions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={reportData.dailyTransactions.map((day) => ({
                  name: format(new Date(day.date), "MMM d"),
                  value: day.count,
                }))}
                index="name"
                categories={["value"]}
                colors={["primary"]}
                valueFormatter={(value: number) => `${value} transactions`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("reports.transactionsByType")}</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={Object.entries(reportData.transactionsByType).map(
                  ([key, value]) => ({
                    name: key,
                    value,
                  })
                )}
                index="name"
                categories={["value"]}
                colors={["primary", "secondary"]}
                valueFormatter={(value: number) => `${value} transactions`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("reports.transactionsByStatus")}</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={Object.entries(reportData.transactionsByStatus).map(
                  ([key, value]) => ({
                    name: key,
                    value,
                  })
                )}
                index="name"
                categories={["value"]}
                colors={["success", "warning", "destructive"]}
                valueFormatter={(value: number) => `${value} transactions`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("reports.transactionsByCurrency")}</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={Object.entries(reportData.transactionsByCurrency).map(
                  ([key, value]) => ({
                    name: key,
                    value,
                  })
                )}
                index="name"
                categories={["value"]}
                colors={["primary", "secondary", "accent", "muted"]}
                valueFormatter={(value: number) => `${value} transactions`}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 