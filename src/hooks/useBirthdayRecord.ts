import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { BirthdayRecord } from '@/src/types';

export const useBirthdayRecords = () =>
  useQuery<BirthdayRecord[]>({
    queryKey: ['birthdayRecords'],
    queryFn: async () => {
      const res = await axios.get('/api/birthday_record');
        console.log('Birthday Records API response:', res.data); // <-- log here
      return res.data;
    },
  });

export const useSendBirthdayEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      const res = await axios.post('/api/birthday_record', { employeeId });
            console.log('Employees API response:', res.data); // <-- log here

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdayRecords'] });
    },
  });
};