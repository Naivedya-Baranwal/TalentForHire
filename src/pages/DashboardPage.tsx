import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Clock,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { db } from '@/lib/database';

// Import thunks
import { fetchJobs } from '@/features/jobs/jobsThunks';
import { fetchCandidates } from '@/features/candidates/candidatesThunks';

// Import selectors
import { 
  selectJobs, 
  selectJobsLoading, 
} from '@/features/jobs/jobsSlice';
import { 
  selectCandidates, 
  selectCandidatesLoading, 
} from '@/features/candidates/candidatesSlice';
import { 
  selectCurrentAssessment,
  selectAssessmentsLoading,
} from '@/features/assessments/assessmentsSlice';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  loading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  loading = false,
  onClick 
}) => {
  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-8 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-2" />
          <Skeleton className="h-3 w-[80px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all duration-200",
        onClick && "cursor-pointer hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [assessmentCount, setAssessmentCount] = React.useState(0);
  const [totalJobsCount, setTotalJobsCount] = React.useState(0);
  const [totalCandidatesCount, setTotalCandidatesCount] = React.useState(0);
  const [totalHiredCount, setTotalHiredCount] = React.useState(0);

  // Selectors
  const jobs = useSelector(selectJobs);
  const jobsLoading = useSelector(selectJobsLoading);

  const candidates = useSelector(selectCandidates);
  const candidatesLoading = useSelector(selectCandidatesLoading);

  const currentAssessment = useSelector(selectCurrentAssessment);
  const assessmentsLoading = useSelector(selectAssessmentsLoading);

  // Fetch data on mount and get total counts from database
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch data for display
      // await Promise.all([
      //   dispatch(fetchJobs({ page: 1, pageSize: 50 })),
      //   dispatch(fetchCandidates({ page: 1, pageSize: 50 }))
      // ]);
await Promise.all([
  dispatch(fetchJobs({ page: 1, pageSize: Number.MAX_SAFE_INTEGER })),
  dispatch(fetchCandidates({ page: 1, pageSize: Number.MAX_SAFE_INTEGER }))
]);

      // Get total counts from database
      try {
        const [jobCount, candidateCount, assessmentCount, allCandidates] = await Promise.all([
          db.jobs.count(),
          db.candidates.count(),
          db.assessments.count(),
          db.candidates.toArray()
        ]);
        
        const hiredCount = allCandidates.filter(c => c.stage === 'hired').length;
        
        setTotalJobsCount(jobCount);
        setTotalCandidatesCount(candidateCount);
        setAssessmentCount(assessmentCount);
        setTotalHiredCount(hiredCount);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // Update counts when data changes
  useEffect(() => {
    const updateCounts = async () => {
      try {
        const [jobCount, candidateCount, assessmentCount, allCandidates] = await Promise.all([
          db.jobs.count(),
          db.candidates.count(),
          db.assessments.count(),
          db.candidates.toArray()
        ]);
        
        const hiredCount = allCandidates.filter(c => c.stage === 'hired').length;
        
        setTotalJobsCount(jobCount);
        setTotalCandidatesCount(candidateCount);
        setAssessmentCount(assessmentCount);
        setTotalHiredCount(hiredCount);
      } catch (error) {
        console.error('Failed to update counts:', error);
      }
    };
    
    updateCounts();
  }, [jobs, candidates, currentAssessment]);

  // Calculate statistics using total counts
  // const activeJobs = jobs.filter(job => job.status === 'active').length;

  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentCandidates = [...candidates]
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 5);

  const isLoading = jobsLoading || candidatesLoading || assessmentsLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-[#28d768] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your recruitment pipeline
          </p>
        </div>

<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-8">
  <StatCard
    title="Jobs"
    value={totalJobsCount}
    description="Total jobs"
    icon={Briefcase}
    loading={jobsLoading}
    onClick={() => navigate('/jobs')}
  />
  <StatCard
    title="Candidates"
    value={totalCandidatesCount}
    description="Total candidates"
    icon={Users}
    loading={candidatesLoading}
    onClick={() => navigate('/candidates')}
  />
  <StatCard
    title="Assessments"
    value={assessmentCount}
    description="Total assessments"
    icon={FileText}
    loading={assessmentsLoading}
  />
  <StatCard
    title="Total Hired"
    value={totalHiredCount}
    description="Candidates hired"
    icon={UserCheck}
    loading={candidatesLoading}
  />
</div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Recent Candidates
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/candidates')}
                >
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Latest applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidatesLoading ? (
                  <>
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </>
                ) : recentCandidates.length > 0 ? (
                  recentCandidates.slice(0, 5).map((candidate) => {
                    const job = jobs.find(j => j.id === candidate.job_id);
                    return (
                      <div 
                        key={candidate.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {job?.title || 'Position'}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/candidates/${candidate.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No candidates available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right side - Recent Jobs */}
          <Card >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Recent Jobs
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/jobs')}
                >
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Latest job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobsLoading ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {job.department}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No jobs available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant='outline' onClick={() => navigate('/jobs')} className="gap-2 bg-[#28d768] text-black">
              <Briefcase className="h-4 w-4" />
              Post New Job
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/candidates')}
              className="gap-2 bg-[#28d768] text-black "
            >
              <Users className="h-4 w-4" />
              Review Candidates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;