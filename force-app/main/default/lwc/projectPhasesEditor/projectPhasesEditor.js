import { getRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, wire } from 'lwc';
import PROJECT_NAME_FIELD from '@salesforce/schema/Project__c.Name';

export default class ProjectPhasesEditor extends LightningElement {
    @api recordId;

    phases = [
        {
            name: 'Phase 1',
            duration: 9,
            startDate: '2025-01-01',
            endDate: '2025-01-10',
        },
        {
            name: 'Phase 2',
            duration: 9,
            startDate: '2025-01-11',
            endDate: '2025-01-20',
        },
        {
            name: 'Phase 3',
            duration: 9,
            startDate: '2025-01-21',
            endDate: '2025-01-30',
        },
    ];

    @wire(getRecord, { recordId: '$recordId', fields: [PROJECT_NAME_FIELD] })
    project;

    handlePhaseChange(event) {
        const incomingPhase = event.detail;
        this.phases = this.phases.map((phase) => {
            if (incomingPhase.name !== phase.name) {
                return phase;
            }
            return incomingPhase;
        });
    }
}
