/* eslint-disable no-undef */
import { getRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import dayjs_resource from '@salesforce/resourceUrl/dayjs';
import PROJECT_NAME_FIELD from '@salesforce/schema/Project__c.Name';

export default class ProjectPhasesEditor extends LightningElement {
    @api recordId;

    @track phases = [
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
        const incomingPhaseIndex = this.phases.findIndex(
            (phase) => phase.name === incomingPhase.name,
        );
        const oldPhase = this.phases[incomingPhaseIndex];
        this.phases[incomingPhaseIndex] = incomingPhase;
        if (incomingPhase.startDate !== oldPhase.startDate) {
            if (incomingPhaseIndex > 0) {
                let priorPhase = incomingPhase;
                for (let i = incomingPhaseIndex - 1; i >= 0; i--) {
                    const phase = this.phases[i];
                    phase.endDate = dayjs(priorPhase.startDate).add(-1, 'day').toDate();
                    phase.startDate = dayjs(phase.endDate).add(-phase.duration, 'day').toDate();
                    priorPhase = phase;
                }
            }
        }
    }
}
