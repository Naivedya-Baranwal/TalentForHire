import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft,ArrowBigLeft, Users, FileText, MapPin, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { selectJobById, selectJobDetailLoading } from '@/features/jobs/jobsSlice';
import { fetchJobById } from '@/features/jobs/jobsThunks';
import { RootState, AppDispatch } from '@/store';
import KanbanBoard from '@/components/KanbanBoard';
import { cn } from '@/lib/utils';

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const job = useSelector((state: RootState) => (jobId ? selectJobById(state, jobId) : undefined));
  const loading = useSelector(selectJobDetailLoading);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId]);

  if (loading && (!job || Object.keys(job).length === 0)) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Loading job...</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-4">Please wait while we fetch the job details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Job not found</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 px-4">The job you're looking for doesn't exist.</p>
          <Button asChild className="mt-4 w-full sm:w-auto">
            <Link to="/jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/15 text-success border-success/30';
      case 'draft': return 'bg-warning/15 text-warning border-warning/30';
      case 'archived': return 'bg-muted/60 text-muted-foreground border-border';
      default: return 'bg-secondary/40 text-secondary-foreground border-border';
    }
  };

  const getStatusStripeStyle = (status: string): React.CSSProperties => {
    switch (status) {
      case 'active': return { borderLeftColor: 'hsl(var(--success))' };
      case 'draft': return { borderLeftColor: 'hsl(var(--warning))' };
      case 'archived': return { borderLeftColor: 'hsl(var(--muted-foreground))' };
      default: return { borderLeftColor: 'hsl(var(--accent-foreground))' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header / Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
        

          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Hero card with status stripe */}
          <Card
            className="flex-1 bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden relative border-l-4"
            style={getStatusStripeStyle(job.status)}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                 <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/jobs">
              <ArrowBigLeft className="h-8 w-8" />
            </Link>
          </Button>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground">
                    {job.title}
                  </h1>
                  <Badge className={cn('border px-3 py-1 rounded-full', getStatusBadgeClass(job.status))}>
                    {job.status}
                  </Badge>
                </div>

                {/* Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:ml-12 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex sm:justify-end">
                  <Link to={`/assessments/${job.id}`} aria-label="Open assessment">
                    <Button
                      variant="outline"
                      className="h-12 w-12 place-items-center flex rounded-full sm:h-12 sm:w-auto sm:px-4 sm:rounded-xl"
                    >
                      <FileText className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Assessment</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="candidates" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-full sm:max-w-md bg-card border border-border rounded-xl">
            <TabsTrigger value="candidates" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Candidates</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Job Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
          </TabsList>

          {/* Board */}
          <TabsContent value="candidates" className="space-y-4 sm:space-y-6">
            <KanbanBoard jobId={job.id} />
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              {/* Main: Description + Tags stacked */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Description</CardTitle>
                    <CardDescription className="text-muted-foreground">Role overview and responsibilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {job.description || 'No description provided.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Tags moved here, directly below Description */}
                <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Tags</CardTitle>
                    <CardDescription className="text-muted-foreground">Related skills and keywords</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {job.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs rounded-full bg-muted/40 text-foreground border-border">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Job Information only */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Job Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Key attributes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Type</div>
                      <div className="text-sm sm:text-base text-foreground">{job.type}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Department</div>
                      <div className="text-sm sm:text-base text-foreground">{job.department}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Location</div>
                      <div className="text-sm sm:text-base text-foreground">{job.location}</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">Created</div>
                      <div className="text-sm sm:text-base text-foreground">{new Date(job.created_at).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobDetailsPage;
