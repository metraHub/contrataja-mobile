import { useState, useCallback, useEffect, useRef } from 'react';
import { profilesApi } from '../../services/profilesApi';
import { TalentResult } from '../../../../types';

export type WorkModeFilter = 'REMOTO' | 'PRESENCIAL' | 'AMBOS' | '';
export type ExperienceFilter = '' | '0' | '1' | '3' | '5';

export default function useFindTalent() {
  const [professionals, setProfessionals] = useState<TalentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [query, setQuery] = useState('');
  const [workMode, setWorkMode] = useState<WorkModeFilter>('');
  const [minExperience, setMinExperience] = useState<ExperienceFilter>('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    loadAvailableTalents();
  }, []);

  // Filter chips search immediately on selection; only the free-text query
  // waits for an explicit submit. Skip the initial mount so this doesn't
  // fire a redundant search on top of loadAvailableTalents above.
  const didMountFilters = useRef(false);
  useEffect(() => {
    if (!didMountFilters.current) {
      didMountFilters.current = true;
      return;
    }
    search();
  }, [workMode, minExperience, areaFilter]);

  const loadAvailableTalents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profilesApi.getAvailableTalents();
      setProfessionals(data);
      setHasSearched(true);
    } catch {
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params: Record<string, string> = {};
      if (query.trim()) params.query = query.trim();
      if (workMode) params.workMode = workMode;
      if (minExperience) params.minExperience = minExperience;
      if (areaFilter) params.areaAtuacao = areaFilter;

      const data = await profilesApi.searchProfessionals(params);
      setProfessionals(data);
    } catch {
      setProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, workMode, minExperience, areaFilter]);

  const clearFilters = useCallback(() => {
    setWorkMode('');
    setMinExperience('');
    setAreaFilter('');
    loadAvailableTalents();
  }, []);

  const totalExperience = (p: TalentResult) =>
    p.experiences?.reduce((sum, e) => sum + e.years, 0) ?? 0;

  return {
    professionals,
    isLoading,
    hasSearched,
    query,
    setQuery,
    workMode,
    setWorkMode,
    minExperience,
    setMinExperience,
    areaFilter,
    setAreaFilter,
    search,
    clearFilters,
    totalExperience,
  };
}
