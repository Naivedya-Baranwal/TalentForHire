// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   MapPin,
//   Briefcase,
//   Plus,
//   MessageSquare,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";
// import {
//   selectCandidateById,
//   selectCandidateDetailLoading
// } from "@/features/candidates/candidatesSlice";
// import { fetchCandidateById, addCandidateNote } from "@/features/candidates/candidatesThunks";
// import { selectJobById } from "@/features/jobs/jobsSlice";
// import { RootState, AppDispatch } from "@/store";

// const CandidateDetailsPage: React.FC = () => {
//   const { candidateId } = useParams<{ candidateId: string }>();
//   const dispatch = useDispatch<AppDispatch>();
//   const { toast } = useToast();

//   const candidate = useSelector((state: RootState) =>
//     candidateId ? selectCandidateById(state, candidateId) : null
//   );
//   const loading = useSelector(selectCandidateDetailLoading);
//   const job = useSelector((state: RootState) =>
//     candidate ? selectJobById(state, candidate.job_id) : null
//   );

//   const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
//   const [noteContent, setNoteContent] = useState("");

//   // Load candidate data
//   useEffect(() => {
//     if (candidateId) {
//       dispatch(fetchCandidateById(candidateId));
//     }
//   }, [dispatch, candidateId]);

//   // Show spinner while loading and no candidate data yet (matches JobsPage behavior)
//   if (loading && (!candidate || Object.keys(candidate).length === 0)) {
//     return (
//       <div className="container mx-auto px-4 py-4 sm:py-8">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
//             <h3 className="text-base sm:text-lg font-medium mb-2">Loading candidate...</h3>
//             <p className="text-sm sm:text-base text-muted-foreground px-4">
//               Please wait while we fetch the candidate profile.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If not loading and no candidate, show not-found state
//   if (!candidate) {
//     return (
//       <div className="container mx-auto px-4 py-4 sm:py-8">
//         <div className="text-center">
//           <h1 className="text-xl sm:text-2xl font-bold">Candidate not found</h1>
//           <p className="text-sm sm:text-base text-muted-foreground mt-2 px-4">
//             The candidate you're looking for doesn't exist.
//           </p>
//           <Button asChild className="mt-4 w-full sm:w-auto">
//             <Link to="/candidates">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Candidates
//             </Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();

//   const getStageColor = (stage: string) => {
//     switch (stage) {
//       case "applied":
//         return "bg-blue-100 text-blue-800";
//       case "screen":
//         return "bg-yellow-100 text-yellow-800";
//       case "tech":
//         return "bg-purple-100 text-purple-800";
//       case "offer":
//         return "bg-orange-100 text-orange-800";
//       case "hired":
//         return "bg-green-100 text-green-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleAddNote = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!noteContent.trim()) return;

//     dispatch(
//       addCandidateNote({
//         candidateId: candidate.id,
//         content: noteContent,
//       })
//     );

//     setNoteContent("");
//     setIsNoteModalOpen(false);

//     toast({
//       title: "Note added",
//       description: "Note has been added to candidate profile.",
//     });
//   };

//   const getTimelineIcon = (type: string) => {
//     switch (type) {
//       case "applied":
//         return "📝";
//       case "screen":
//         return "📞";
//       case "tech":
//         return "💻";
//       case "offer":
//         return "🎯";
//       case "hired":
//         return "✅";
//       case "rejected":
//         return "❌";
//       case "note_added":
//         return "📝";
//       default:
//         return "📋";
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
//         <Button variant="ghost" size="sm" asChild className="w-fit">
//           <Link to="/candidates">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             <span className="hidden sm:inline">Back to Candidates</span>
//             <span className="sm:hidden">Back</span>
//           </Link>
//         </Button>
        
//         <div className="hidden sm:block h-6 w-px bg-border" />
        
//         <div className="flex-1">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
//             <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto sm:mx-0">
//               <AvatarImage src={candidate.avatar} alt={candidate.name} />
//               <AvatarFallback className="text-sm sm:text-xl">
//                 {getInitials(candidate.name)}
//               </AvatarFallback>
//             </Avatar>
            
//             <div className="text-center sm:text-left flex-1">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
//                 <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{candidate.name}</h1>
//                 <Badge
//                   className={`${getStageColor(candidate.stage)} w-fit mx-auto sm:mx-0`}
//                   variant="secondary"
//                 >
//                   {candidate.stage}
//                 </Badge>
//               </div>
              
//               {/* Contact info - stacked on mobile, inline on larger screens */}
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
//                 <div className="flex items-center justify-center sm:justify-start gap-1">
//                   <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
//                   <span className="truncate">{candidate.email}</span>
//                 </div>
//                 <div className="flex items-center justify-center sm:justify-start gap-1">
//                   <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
//                   <span>{candidate.phone}</span>
//                 </div>
//                 <div className="flex items-center justify-center sm:justify-start gap-1">
//                   <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
//                   <span>{candidate.location}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className="w-full sm:w-auto">
//               <Plus className="h-4 w-4 mr-2" />
//               <span className="sm:hidden">Add Note</span>
//               <span className="hidden sm:inline">Add Note</span>
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="mx-4 sm:mx-0 !ml-0 !mr-0 w-[95%]">
//             <form onSubmit={handleAddNote}>
//               <DialogHeader>
//                 <DialogTitle>Add Note</DialogTitle>
//               </DialogHeader>
//               <div className="py-4">
//                 <Label htmlFor="note-content">Note</Label>
//                 <Textarea
//                   id="note-content"
//                   value={noteContent}
//                   onChange={(e) => setNoteContent(e.target.value)}
//                   placeholder="Add your note here..."
//                   className="mt-2"
//                   rows={4}
//                 />
//               </div>
//               <DialogFooter>
//                 <Button type="submit" disabled={!noteContent.trim()} className="w-full sm:w-auto">
//                   Add Note
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Content - responsive grid layout */}
//       <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//           {/* Job Application */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg">Current Application</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <div className="flex-1">
//                   <h3 className="font-medium text-sm sm:text-base">
//                     {job?.title || "Unknown Position"}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-muted-foreground">
//                     Applied on{" "}
//                     {new Date(candidate.applied_at).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
//                   <Link to={`/jobs/${candidate.job_id}`}>View Job</Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Notes */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
//                 <MessageSquare className="h-4 w-4" />
//                 Notes ({candidate.notes.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {candidate.notes.length > 0 ? (
//                 <div className="space-y-3 sm:space-y-4">
//                   {candidate.notes.map((note) => (
//                     <div
//                       key={note.id}
//                       className="border-l-2 border-primary pl-3 sm:pl-4"
//                     >
//                       <p className="text-xs sm:text-sm">{note.content}</p>
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-xs text-muted-foreground">
//                         <span>{note.created_by}</span>
//                         <span className="hidden sm:inline">•</span>
//                         <span>
//                           {new Date(note.created_at).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-xs sm:text-sm text-muted-foreground">No notes added yet.</p>
//               )}
//             </CardContent>
//           </Card>

//           {/* Timeline */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3 sm:space-y-4">
//                 {candidate.timeline.map((event) => (
//                   <div key={event.id} className="flex items-start gap-2 sm:gap-3">
//                     <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center text-xs sm:text-sm">
//                       {getTimelineIcon(event.type)}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs sm:text-sm font-medium">{event.message}</p>
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-xs text-muted-foreground">
//                         <span>{event.created_by}</span>
//                         <span className="hidden sm:inline">•</span>
//                         <span>
//                           {new Date(event.created_at).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-4 sm:space-y-6">
//           {/* Contact Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 sm:space-y-3">
//               <div className="flex items-center gap-2">
//                 <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
//                 <span className="text-xs sm:text-sm truncate">{candidate.email}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
//                 <span className="text-xs sm:text-sm">{candidate.phone}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
//                 <span className="text-xs sm:text-sm">{candidate.location}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
//                 <span className="text-xs sm:text-sm">{candidate.experience}</span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Skills */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-base sm:text-lg">Skills</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-wrap gap-1 sm:gap-2">
//                 {candidate.skills.map((skill) => (
//                   <Badge key={skill} variant="outline" className="text-xs">
//                     {skill}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CandidateDetailsPage;

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Plus,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  selectCandidateById,
  selectCandidateDetailLoading
} from "@/features/candidates/candidatesSlice";
import { fetchCandidateById, addCandidateNote } from "@/features/candidates/candidatesThunks";
import { selectJobById } from "@/features/jobs/jobsSlice";
import { RootState, AppDispatch } from "@/store";
import { cn } from "@/lib/utils";

const CandidateDetailsPage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const candidate = useSelector((state: RootState) =>
    candidateId ? selectCandidateById(state, candidateId) : null
  );
  const loading = useSelector(selectCandidateDetailLoading);
  const job = useSelector((state: RootState) =>
    candidate ? selectJobById(state, candidate.job_id) : null
  );

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    if (candidateId) {
      dispatch(fetchCandidateById(candidateId));
    }
  }, [dispatch, candidateId]);

  if (loading && (!candidate || Object.keys(candidate).length === 0)) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Loading candidate...</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Please wait while we fetch the candidate profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Candidate not found</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 px-4">
            The candidate you're looking for doesn't exist.
          </p>
          <Button asChild className="mt-4 w-full sm:w-auto">
            <Link to="/candidates">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n)
      .join("")
      .toUpperCase();

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

  const getStageStripeStyle = (stage: string): React.CSSProperties => {
    switch (stage) {
      case "applied":
        return { borderLeftColor: "hsl(var(--info))" };
      case "screen":
        return { borderLeftColor: "hsl(var(--warning))" };
      case "tech":
        return { borderLeftColor: "hsl(var(--primary))" };
      case "offer":
        return { borderLeftColor: "hsl(38 92% 55%)" };
      case "hired":
        return { borderLeftColor: "hsl(var(--success))" };
      case "rejected":
        return { borderLeftColor: "hsl(var(--destructive))" };
      default:
        return { borderLeftColor: "hsl(var(--accent-foreground))" };
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    dispatch(
      addCandidateNote({
        candidateId: candidate.id,
        content: noteContent,
      })
    );

    setNoteContent("");
    setIsNoteModalOpen(false);

    toast({
      title: "Note added",
      description: "Note has been added to candidate profile.",
    });
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "applied":
        return "📝";
      case "screen":
        return "📞";
      case "tech":
        return "💻";
      case "offer":
        return "🎯";
      case "hired":
        return "✅";
      case "rejected":
        return "❌";
      case "note_added":
        return "📝";
      default:
        return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Top header actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" asChild className="w-fit">
            <Link to="/candidates">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Candidates</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>

          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Hero card with stage stripe */}
          <Card
            className="flex-1 bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-lg overflow-hidden relative border-l-4"
            style={getStageStripeStyle(candidate.stage)}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 mx-auto sm:mx-0">
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback className="text-sm sm:text-xl">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground truncate">
                      {candidate.name}
                    </h1>
                    <Badge className={cn("border px-3 py-1 rounded-full", getStageBadgeClass(candidate.stage))}>
                      {candidate.stage}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center justify-center sm:justify-start gap-1 min-w-0">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{candidate.location}</span>
                    </div>
                  </div>
                </div>

                {/* Primary view job CTA mirrors list patterns */}
                <div className="sm:self-start">
                  <Link to={`/jobs/${candidate.job_id}`} aria-label="View job">
                    <Button
                      className="bg-gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all
                                 h-10 w-10 p-0 grid place-items-center rounded-full
                                 sm:h-10 sm:w-auto sm:px-4 sm:rounded-xl sm:flex sm:items-center sm:justify-center"
                    >
                      <Eye className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">View Job</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Note */}
          <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="sm:hidden">Add Note</span>
                <span className="hidden sm:inline">Add Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4 sm:mx-0 !ml-0 !mr-0 w-[95%] sm:max-w-[560px] bg-card text-foreground">
              <form onSubmit={handleAddNote}>
                <DialogHeader>
                  <DialogTitle>Add Note</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="note-content">Note</Label>
                  <Textarea
                    id="note-content"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Add your note here..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!noteContent.trim()} className="w-full sm:w-auto">
                    Add Note
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Content */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Current Application */}
            <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Current Application</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Track the current role and application details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                      {job?.title || "Unknown Position"}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Applied on {new Date(candidate.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <Link to={`/jobs/${candidate.job_id}`}>View Job</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MessageSquare className="h-4 w-4" />
                  Notes ({candidate.notes.length})
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Keep track of interactions and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {candidate.notes.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {candidate.notes.map((note) => (
                      <div
                        key={note.id}
                        className="border-l-2 border-primary pl-3 sm:pl-4"
                      >
                        <p className="text-xs sm:text-sm text-foreground">{note.content}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{note.created_by}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(note.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground">No notes added yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Key milestones and updates across the hiring process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {candidate.timeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center text-xs sm:text-sm">
                        {getTimelineIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                          {event.message}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{event.created_by}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(event.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 text-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm truncate">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{candidate.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{candidate.experience}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card/90 border border-border rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Skills</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Expertise and competencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs rounded-full bg-muted/40 text-foreground border-border">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;
