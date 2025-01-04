import { LightningElement, api } from 'lwc';

export default class ProjectPhaseRowEdit extends LightningElement {
    @api phase;

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
                    endDate: this._addToDate(this.phase.startDate, duration),
                },
            }),
        );
    }

    handleStartDateChange(event) {
        this._handleDateChange({ startDate: event.detail.value });
    }

    handleEndDateChange(event) {
        this._handleDateChange({ endDate: event.detail.value });
    }

    _handleDateChange(changes) {
        const startDateString = changes.startDate || this.phase.startDate;
        const endDateString = changes.endDate || this.phase.endDate;
        if (!startDateString || !endDateString) {
            return;
        }
        let startDate = new Date(startDateString);
        let endDate = new Date(endDateString);
        const duration = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        this.dispatchEvent(
            new CustomEvent('phasechange', {
                detail: {
                    ...this.phase,
                    duration,
                    startDate: startDateString,
                    endDate: endDateString,
                },
            }),
        );
    }

    _addToDate(dateString, days) {
        let result = new Date(dateString);
        result.setDate(result.getDate() + days + 1);

        const offset = result.getTimezoneOffset();
        // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd#comment58447831_29774197
        result = new Date(result.getTime() - offset * 60 * 1000);
        return result.toISOString().split('T')[0];
    }
}
