import React, { useState, useEffect } from 'react';
import { IssueItem as IssueItemType } from './types';
import { IssueRow } from './components/IssueRow';
import { api } from './services/api';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
    const [issues, setIssues] = useState<IssueItemType[]>([]);

    useEffect(() => {
        api.getIssues().then(setIssues);

        const subscription = supabase
            .channel('issues-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'issues' },
                (payload) => {
                    switch (payload.eventType) {
                        case 'INSERT':
                            setIssues(prev => [...prev, payload.new as IssueItemType]);
                            break;
                        case 'UPDATE':
                            setIssues(prev => prev.map(issue => issue.id === (payload.new as IssueItemType).id ? payload.new as IssueItemType : issue));
                            break;
                        case 'DELETE':
                            setIssues(prev => prev.filter(issue => issue.id !== (payload.old as any).id.toString()));
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return (
        <div>
            {issues.map(issue => (
                <IssueRow key={issue.id} issue={issue} />
            ))}
        </div>
    );
};

export default App;