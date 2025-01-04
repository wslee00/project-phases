import { LightningElement, api } from 'lwc';

export default class ProjectPhaseRowEdit extends LightningElement {
    @api phase;

    handleDurationChange(event) {
        const duration = parseInt(event.detail.value, 10);
        console.log('add to date', this._addToDate(this.phase.startDate, duration));
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
        this.phase.startDate = event.detail.value;
    }

    handleEndDateChange(event) {
        this.phase.endDate = event.detail.value;
    }

    _addToDate(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days + 1);

        const offset = result.getTimezoneOffset();
        // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd#comment58447831_29774197
        result = new Date(result.getTime() - offset * 60 * 1000);
        return result.toISOString().split('T')[0];
    }
}
