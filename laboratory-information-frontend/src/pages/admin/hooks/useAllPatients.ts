import { useState, useEffect } from 'react';
import axios from 'axios';

interface BackendPatient {
  _id: string;
  patient_code?: string;
  user_id: string;
  is_active: boolean;
  is_deleted: boolean;
  emergency_contact?: {
    name?: string;
    phone?: string;
  };
  created_at?: string;
  updated_at?: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    age?: number;
    address?: string;
    identityNumber?: string;
  } | null;
}

interface GetAllPatientsResponse {
  patients: BackendPatient[];
  total: number;
  page: number;
  totalPages: number;
}

const PATIENT_API_BASE = 'http://localhost:5001/api';

/**
 * Hook to fetch ALL patients from all pages for comprehensive filtering
 * Similar to useAllUsers pattern
 */
export function useAllPatients() {
  const [allPatients, setAllPatients] = useState<BackendPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAllPatientsRecursively = async () => {
      const accumulated: BackendPatient[] = [];
      const currentPage = 1;
      const limit = 100; // Fetch 100 patients per page for efficiency

      try {
        setLoading(true);
        setError(null);

        // Fetch first page to get total pages
        const firstPageUrl = `${PATIENT_API_BASE}/patients/getAll?page=${currentPage}&limit=${limit}`;
        const firstResponse = await axios.get<GetAllPatientsResponse>(firstPageUrl, { timeout: 10000 });
        
        if (!mounted) return;

        const firstPageData = firstResponse.data;
        const totalPages = firstPageData.totalPages || 1;
        
        // Add first page patients
        accumulated.push(...firstPageData.patients);

        // Fetch remaining pages in parallel batches
        const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        
        if (remainingPages.length > 0) {
          const batchSize = 5; // Process 5 pages at a time
          for (let i = 0; i < remainingPages.length; i += batchSize) {
            const batch = remainingPages.slice(i, i + batchSize);
            const promises = batch.map(page => 
              axios.get<GetAllPatientsResponse>(
                `${PATIENT_API_BASE}/patients/getAll?page=${page}&limit=${limit}`,
                { timeout: 10000 }
              )
            );
            
            const responses = await Promise.all(promises);
            responses.forEach(response => {
              accumulated.push(...response.data.patients);
            });

            if (!mounted) return;
          }
        }

        // Filter out deleted patients
        const activePatients = accumulated.filter(p => !p.is_deleted);

        if (mounted) {
          setAllPatients(activePatients);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching all patients:', err);
        if (mounted) {
          setError('Không thể tải danh sách bệnh nhân');
          setLoading(false);
        }
      }
    };

    fetchAllPatientsRecursively();

    return () => {
      mounted = false;
    };
  }, []);

  return { allPatients, loading, error };
}
