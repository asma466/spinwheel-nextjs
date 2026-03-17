import { useMutation } from '@tanstack/react-query';

const spinMutation = useMutation({
    mutationFn: async () => {
        const res = await fetch(`/api/spin?x=${recordId}`);
        return res.json();
    },
    onSuccess: (data) => {
        if (data.success) {
            onFinished(data.gift);
        }
    }
});