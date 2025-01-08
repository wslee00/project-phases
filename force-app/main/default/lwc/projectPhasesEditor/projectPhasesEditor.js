/* eslint-disable no-undef */
import { api, LightningElement, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import dayjs_resource from '@salesforce/resourceUrl/dayjs';
import getProjectPhases from '@salesforce/apex/ProjectPhasesEditorController.getProjectPhases';
import saveProjectPhases from '@salesforce/apex/ProjectPhasesEditorController.saveProjectPhases';

export default class ProjectPhasesEditor extends LightningElement {
    @api recordId;

    @track phases;
    isProcessing = false;

    _isScriptLoaded = false;
    _phasesFromDb = [];
    _projectPhasesResult;

    @wire(getProjectPhases, { projectId: '$recordId' })
    processGetProjectPhases(result) {
        this._projectPhasesResult = result;
        const { error, data } = result;
        if (data) {
            this._phasesFromDb = data;
            this._postProcessPhases();
        }
        if (error) {
            console.log(error);
        }
    }

    async connectedCallback() {
        await loadScript(this, dayjs_resource);
        this._isScriptLoaded = true;
        this._postProcessPhases();
    }

    handlePhaseChange(event) {
        const incomingPhase = event.detail;
        const incomingPhaseIndex = this.phases.findIndex(
            (phase) => phase.name === incomingPhase.name,
        );
        const oldPhase = this.phases[incomingPhaseIndex];
        this.phases[incomingPhaseIndex] = incomingPhase;
        if (incomingPhase.startDate !== oldPhase.startDate) {
            this._shiftPriorPhases(incomingPhaseIndex, incomingPhase);
        } else if (incomingPhase.endDate !== oldPhase.endDate) {
            this._shiftSubsequentPhases(incomingPhaseIndex, incomingPhase);
        }
    }

    async handleSave() {
        const sobjectPhases = this.phases.map((phase) => {
            return {
                Id: phase.id,
                Name: phase.name,
                Start_Date__c: dayjs(phase.startDate).format('YYYY-MM-DD'),
                End_Date__c: dayjs(phase.endDate).format('YYYY-MM-DD'),
            };
        });
        this.isProcessing = true;
        try {
            await saveProjectPhases({ phases: sobjectPhases });
        } catch (error) {
            this.isProcessing = false;
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Saving Project Phases',
                    message: error.body.message,
                    variant: 'error',
                    mode: 'sticky',
                }),
            );
            return;
        }

        this.isProcessing = false;

        refreshApex(this._projectPhasesResult);
        getRecordNotifyChange(sobjectPhases.map((phase) => ({ recordId: phase.Id })));

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Project Phases Saved',
                variant: 'success',
            }),
        );
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    _postProcessPhases() {
        if (!this._isScriptLoaded || this._phasesFromDb.length === 0) {
            return;
        }

        this.phases = this._phasesFromDb.map((phase) => {
            return {
                id: phase.Id,
                name: phase.Name,
                duration: phase.Duration__c,
                startDate: dayjs(phase.Start_Date__c).toDate(),
                endDate: dayjs(phase.End_Date__c).toDate(),
            };
        });
    }

    _shiftPriorPhases(incomingPhaseIndex, incomingPhase) {
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

    _shiftSubsequentPhases(incomingPhaseIndex, incomingPhase) {
        if (incomingPhaseIndex < this.phases.length - 1) {
            let nextPhase = incomingPhase;
            for (let i = incomingPhaseIndex + 1; i < this.phases.length; i++) {
                const phase = this.phases[i];
                phase.startDate = dayjs(nextPhase.endDate).add(1, 'day').toDate();
                phase.endDate = dayjs(phase.startDate).add(phase.duration, 'day').toDate();
                nextPhase = phase;
            }
        }
    }
}
