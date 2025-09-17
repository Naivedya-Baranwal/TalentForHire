import api from './api';
import type { Candidate } from '../lib/database';

export interface CandidatesQueryParams {
  search?: string;
  stage?: 'all' | 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  job_id?: string;
  page?: number;
  pageSize?: number;
}

export const candidatesApi = {
  async getCandidates(params: CandidatesQueryParams = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== 'all') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/candidates?${searchParams.toString()}`);
    console.log("Candidates API Response:", response);
    return response; 
  },

  async getCandidateById(id: string) {
    const response = await api.get(`/candidates/${id}`);
    // Don't access .data
    return response;
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    const response = await api.patch(`/candidates/${id}`, updates);
    // Don't access .data
    return response;
  },

  // Update candidate stage with timeline
  async updateCandidateStageWithTimeline(
    candidateId: string,
    candidateName: string,
    previousStage: string,
    newStage: string,
    previousStageTitle: string,
    newStageTitle: string
  ) {
    const response = await api.patch(`/candidates/${candidateId}/stage`, {
      candidateName,
      previousStage,
      newStage,
      previousStageTitle,
      newStageTitle
    });
    return response;
  },

  async addCandidateNote(candidateId: string, content: string, isPrivate = false) {
    const response = await api.post(`/candidates/${candidateId}/notes`, {
      content,
      is_private: isPrivate
    });
    return response;
  },

  async getCandidatesByStage(jobId?: string) {
    const response = await this.getCandidates({ 
      job_id: jobId, 
      pageSize: 1000 
    });
    
    let candidates = [];
    if (response?.success && response?.data?.candidates) {
      candidates = response.data.candidates;
    } else if (response?.data && Array.isArray(response.data)) {
      candidates = response.data;
    } else if (Array.isArray(response)) {
      candidates = response;
    } else {
      console.error('Unexpected candidates response structure:', response);
      candidates = [];
    }
    
    const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
    const candidatesByStage: { [stage: string]: Candidate[] } = {};
    
    stages.forEach(stage => {
      candidatesByStage[stage] = candidates.filter((candidate: Candidate) => candidate.stage === stage);
    });
    
    return candidatesByStage; 
  }
};

export default candidatesApi;
