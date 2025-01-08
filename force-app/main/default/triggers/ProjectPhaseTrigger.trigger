trigger ProjectPhaseTrigger on Project_Phase__c(after insert, after update) {
    new ProjectPhaseTriggerHandler().run();
}
