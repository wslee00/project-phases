/* eslint-disable no-undef */
import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import dayjs_resource from '@salesforce/resourceUrl/dayjs';

export default class ProjectPhaseRowEdit extends LightningElement {
    @api phase;
    isScriptLoaded = false;

    async connectedCallback() {
        await loadScript(this, dayjs_resource);
        this.isScriptLoaded = true;
    }

    handleDurationChange(event) {
        if (!event.detail.value) {
            return;
        }
        const duration = parseInt(event.detail.value, 10);
        this.dispatchEvent(
            new CustomEvent('phasechange', {
                detail: {
                    ...this.phase,
                    duration,
                    endDate: dayjs(this.phase.startDate).add(duration, 'day').toDate(),
                },
            }),
        );
    }

    get startDate() {
        return dayjs(this.phase.startDate).format('YYYY-MM-DD');
    }

    get endDate() {
        return dayjs(this.phase.endDate).format('YYYY-MM-DD');
    }

    handleStartDateChange(event) {
        const dateString = event.detail.value;
        if (!dateString) {
            return;
        }
        this._handleDateChange({ startDate: dayjs(event.detail.value).toDate() });
    }

    handleEndDateChange(event) {
        const dateString = event.detail.value;
        if (!dateString) {
            return;
        }
        this._handleDateChange({ endDate: dayjs(event.detail.value).toDate() });
    }

    _handleDateChange(changes) {
        const startDate = changes.startDate || this.phase.startDate;
        const endDate = changes.endDate || this.phase.endDate;
        if (!startDate || !endDate) {
            return;
        }
        const duration = dayjs(endDate).diff(startDate, 'day');
        this.dispatchEvent(
            new CustomEvent('phasechange', {
                detail: {
                    ...this.phase,
                    duration,
                    startDate: startDate,
                    endDate: endDate,
                },
            }),
        );
    }
}
