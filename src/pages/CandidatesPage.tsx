import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, User, MapPin, Briefcase, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  selectPaginatedCandidates,
  selectCandidatesFilters,
  selectCandidatesPagination,
  selectCandidatesLoading,
  setFilters,
  setPagination,
} from "@/features/candidates/candidatesSlice";
import { fetchCandidates } from "@/features/candidates/candidatesThunks";
import { selectJobs } from "@/features/jobs/jobsSlice";
import { RootState, AppDispatch } from "@/store";
import { Link } from "react-router-dom";
import Pagination from "@/components/Pagination";
import { cn } from "@/lib/utils";

const CandidatesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    candidates = [],
    totalCandidates = 0,
    totalPages = 0,
  } = useSelector(selectPaginatedCandidates);
  const filters = useSelector(selectCandidatesFilters);
  const pagination = useSelector(selectCandidatesPagination);
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectCandidatesLoading);

  // Load data on component mount and when filters change
  useEffect(() => {
    dispatch(
      fetchCandidates({
        search: filters.search,
        stage: filters.stage !== "all" ? filters.stage : undefined,
        job_id: filters.job_id || undefined,
        page: pagination.currentPage,
        pageSize: pagination.itemsPerPage,
      })
    );
  }, [
    dispatch,
    filters.search,
    filters.stage,
    filters.job_id,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  const jobsMap = useMemo(() => {
    return jobs.reduce((acc, job) => {
      acc[job.id] = job;
      return acc;
    }, {} as Record<string, any>);
  }, [jobs]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n)
      .join("")
      .toUpperCase();

  // Token-friendly stage → badge classes (works in light/dark)
  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case "applied":
        return "bg-info/15 text-info border-info/30";
      case "screen":
        return "bg-warning/15 text-warning border-warning/30";
      case "tech":
        return "bg-primary/15 text-primary border-primary/30";
      case "offer":
        return "bg-amber-400/15 text-amber-500 border-amber-400/30 dark:bg-amber-300/15 dark:text-amber-300 dark:border-amber-300/30";
      case "hired":
        return "bg-success/15 text-success border-success/30";
      case "rejected":
        return "bg-destructive/15 text-destructive border-destructive/30";
      default:
        return "bg-muted/60 text-muted-foreground border-border";
    }
  };

  // Stage → left stripe color (border-left) using CSS variables
  const getStageStripeStyle = (stage: string): React.CSSProperties => {
    switch (stage) {
      case "applied":
        return { borderLeftColor: "hsl(var(--info))" };
      case "screen":
        return { borderLeftColor: "hsl(var(--warning))" };
      case "tech":
        return { borderLeftColor: "hsl(var(--primary))" };
      case "offer":
        return { borderLeftColor: "hsl(38 92% 55%)" }; // amber-like, consistent with tokens above
      case "hired":
        return { borderLeftColor: "hsl(var(--success))" };
      case "rejected":
        return { borderLeftColor: "hsl(var(--destructive))" };
      default:
        return { borderLeftColor: "hsl(var(--accent-foreground))" };
    }
  };

  // Show loading screen when loading and no candidates yet
  if (loading && (!candidates || candidates.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-base md:text-lg font-medium mb-2">Loading candidates...</h3>
            <p className="text-sm md:text-base text-muted-foreground px-4">
              Please wait while we fetch candidate profiles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Centered Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gradient-primary mb-3">
            Candidates
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            View and manage all candidates across all job positions
          </p>

        {/* Centered Controls */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  value={filters.search}
                  onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                  className="pl-10 h-12 text-base border-2 border-border rounded-xl focus:border-ring focus:ring-2 focus:ring-ring/20 bg-card text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:flex md:gap-4 w-full md:w-auto">
                {/* Stage filter */}
                <Select
                  value={filters.stage || "all"}
                  onValueChange={(value) =>
                    dispatch(setFilters({ stage: value === "all" ? "all" : (value as any) }))
                  }
                >
                  <SelectTrigger className="w-full md:w-40 h-12 border-2 border-border rounded-xl focus:border-ring bg-card text-foreground">
                    <Filter className="h-5 w-5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screen">Screening</SelectItem>
                    <SelectItem value="tech">Technical</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                {/* Job filter */}
                <Select
                  value={filters.job_id || "all"}
                  onValueChange={(value) =>
                    dispatch(setFilters({ job_id: value === "all" ? "" : value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-48 h-12 border-2 border-border rounded-xl focus:border-ring bg-card text-foreground">
                    <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground bg-card/70 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-border">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, totalCandidates)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, totalCandidates)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{totalCandidates}</span> candidates
          </p>
        </div>

        {/* Candidates list */}
        <div className="space-y-4 mb-10 max-w-4xl mx-auto">
          {candidates.length > 0 ? (
            candidates.map((candidate) => {
              const job = jobsMap[candidate.job_id];
              return (
                <Card
                  key={candidate.id}
                  className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden relative border-l-4"
                  style={getStageStripeStyle(candidate.stage)}
                >
                  <CardHeader className="p-4 sm:p-6">
                    {/* Top right stage badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage
                            src={candidate.avatar}
                            alt={candidate.name}
                          />
                          <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <CardTitle className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors truncate">
                            <Link to={`/candidates/${candidate.id}`}>{candidate.name}</Link>
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm text-muted-foreground">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                <span className="truncate">{candidate.email}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {candidate.experience}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>

                      <Badge
                        className={cn(
                          "border font-semibold px-3 py-1 rounded-full flex-shrink-0",
                          getStageBadgeClass(candidate.stage)
                        )}
                      >
                        {candidate.stage}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 sm:px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs rounded-full bg-muted/40 text-foreground border-border">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 6 && (
                          <Badge variant="outline" className="text-xs rounded-full">
                            +{candidate.skills.length - 6}
                          </Badge>
                        )}
                      </div>

                      {/* Applied job */}
                      <div className="text-sm text-muted-foreground">
                        Applied to:{" "}
                        <span className="font-medium text-foreground">
                          {job?.title || "Unknown Job"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom-right View button: icon-only on mobile, labeled on sm+ */}
                    <div className="mt-4 sm:mt-5 flex justify-end">
                      <Link to={`/candidates/${candidate.id}`} aria-label="View profile">
                        <button
                          className="
                            bg-gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all
                            h-10 w-10 p-0 grid place-items-center rounded-full
                            sm:h-10 sm:w-auto sm:px-4 sm:rounded-xl sm:flex sm:items-center sm:justify-center
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                          "
                          type="button"
                        >
                          <Eye className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">View Profile</span>
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border max-w-md mx-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No candidates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            {/* <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-border"> */}
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={(page) =>
                  dispatch(setPagination({ currentPage: page }))
                }
                showInfo={true}
                totalItems={totalCandidates}
                itemsPerPage={pagination.itemsPerPage}
              />
            {/* </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
