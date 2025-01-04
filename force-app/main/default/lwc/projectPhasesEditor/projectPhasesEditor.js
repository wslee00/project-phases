import { getRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, wire } from 'lwc';
import PROJECT_NAME_FIELD from '@salesforce/schema/Project__c.Name';

export default class ProjectPhasesEditor extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [PROJECT_NAME_FIELD] })
    project;
}
