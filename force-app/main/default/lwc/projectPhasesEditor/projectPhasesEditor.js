import { getRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import dayjs_resource from '@salesforce/resourceUrl/dayjs';
import PROJECT_NAME_FIELD from '@salesforce/schema/Project__c.Name';

export default class ProjectPhasesEditor extends LightningElement {
    @api recordId;

    phases = [
        {
            name: 'Phase 1',
            duration: 9,
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-01-10'),
        },
        {
            name: 'Phase 2',
            duration: 9,
            startDate: new Date('2025-01-11'),
            endDate: new Date('2025-01-20'),
        },
        {
            name: 'Phase 3',
            duration: 9,
            startDate: new Date('2025-01-21'),
            endDate: new Date('2025-01-30'),
        },
    ];

    @wire(getRecord, { recordId: '$recordId', fields: [PROJECT_NAME_FIELD] })
    project;

    async connectedCallback() {
        await loadScript(this, dayjs_resource);
    }

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
