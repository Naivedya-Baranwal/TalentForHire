// KanbanBoard.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { selectCandidatesByStage } from '@/features/candidates/candidatesSlice';
import { fetchCandidatesByStage, updateCandidateStageWithTimeline } from '@/features/candidates/candidatesThunks';
import { RootState, AppDispatch } from '@/store';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  jobId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ jobId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const candidatesByStage = useSelector((state: RootState) => selectCandidatesByStage(state, jobId));

  useEffect(() => {
    dispatch(fetchCandidatesByStage(jobId));
  }, [dispatch, jobId]);

  const stages = [
    { id: 'applied', title: 'Applied' },
    { id: 'screen', title: 'Screening' },
    { id: 'tech', title: 'Technical' },
    { id: 'offer', title: 'Offer' },
    { id: 'hired', title: 'Hired' },
    { id: 'rejected', title: 'Rejected' },
  ];

  const getStageTitle = (stageId: string) => stages.find(s => s.id === stageId)?.title || stageId;

  const findCandidateById = (candidateId: string) => {
    for (const stageId of Object.keys(candidatesByStage)) {
      const candidate = candidatesByStage[stageId]?.find(c => c.id === candidateId);
      if (candidate) return candidate;
    }
    return null;
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const candidate = findCandidateById(draggableId);
    if (!candidate) return;

    const previousStage = source.droppableId;
    const newStage = destination.droppableId;
    const previousStageTitle = getStageTitle(previousStage);
    const newStageTitle = getStageTitle(newStage);

    dispatch(updateCandidateStageWithTimeline({
      candidateId: draggableId,
      candidateName: candidate.name,
      previousStage,
      newStage,
      previousStageTitle,
      newStageTitle
    }));

    toast({
      title: "Candidate moved",
      description: `${candidate.name} moved from ${previousStageTitle} to ${newStageTitle}`
    });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n).join('').toUpperCase();

  const getStageBadgeClass = (stageId: string) => {
    switch (stageId) {
      case 'applied': return 'bg-info/15 text-info border-info/30';
      case 'screen': return 'bg-warning/15 text-warning border-warning/30';
      case 'tech': return 'bg-primary/15 text-primary border-primary/30';
      case 'offer': return 'bg-amber-400/15 text-amber-500 border-amber-400/30 dark:bg-amber-300/15 dark:text-amber-300 dark:border-amber-300/30';
      case 'hired': return 'bg-success/15 text-success border-success/30';
      case 'rejected': return 'bg-destructive/15 text-destructive border-destructive/30';
      default: return 'bg-muted/60 text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Candidate Pipeline</h2>
        <p className="text-muted-foreground">
          Total: {Object.values(candidatesByStage).flat().length} candidates
        </p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <div className="
            grid gap-4
            grid-flow-col auto-cols-[minmax(260px,1fr)] 
            md:grid-flow-row md:auto-cols-auto md:grid md:grid-cols-6
          ">
            {stages.map((stage) => (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{stage.title}</h3>
                  <Badge variant="outline" className={cn('border font-semibold px-2 py-0.5 text-xs', getStageBadgeClass(stage.id))}>
                    {candidatesByStage[stage.id]?.length || 0}
                  </Badge>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        'space-y-2 min-h-[220px] p-2 rounded-xl border-2 border-dashed transition-colors',
                        snapshot.isDraggingOver
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      )}
                    >
                      {candidatesByStage[stage.id]?.map((candidate, index) => (
                        <Draggable key={candidate.id} draggableId={candidate.id} index={index}>
                          {(prov, snap) => (
                            <Card
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={cn(
                                'bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative',
                                'cursor-grab active:cursor-grabbing',
                                snap.isDragging ? 'shadow-lg ring-1 ring-primary/20' : ''
                              )}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Avatar className="h-8 w-8 flex-shrink-0">
                                    <AvatarImage src={candidate.avatar} />
                                    <AvatarFallback className="text-[10px]">
                                      {getInitials(candidate.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <CardTitle className="text-sm truncate text-foreground">
                                      <Link to={`/candidates/${candidate.id}`} className="hover:text-primary transition-colors">
                                        {candidate.name}
                                      </Link>
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground truncate">
                                      {candidate.email}
                                    </CardDescription>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent className="pt-0">
                                <div className="space-y-2">
                                  <p className="text-xs text-muted-foreground">
                                    {candidate.experience} • {candidate.location}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.skills.slice(0, 2).map((skill: string) => (
                                      <Badge key={skill} variant="outline" className="text-[10px] rounded-full bg-muted/40 text-foreground border-border">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {candidate.skills.length > 2 && (
                                      <Badge variant="outline" className="text-[10px] rounded-full bg-muted/40 text-foreground border-border">
                                        +{candidate.skills.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Applied {new Date(candidate.applied_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
