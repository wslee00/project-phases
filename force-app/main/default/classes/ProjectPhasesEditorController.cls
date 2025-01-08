/**
 * Controller class for projectPhasesEditor LWC
 */
public with sharing class ProjectPhasesEditorController {
    @AuraEnabled(cacheable=true)
    public static List<Project_Phase__c> getProjectPhases(Id projectId) {
        return [
            SELECT Name, Duration__c, Start_Date__c, End_Date__c
            FROM Project_Phase__c
            WHERE Project__c = :projectId
            ORDER BY Start_Date__c
        ];
    }

    @AuraEnabled
    public static void saveProjectPhases(List<Project_Phase__c> phases) {
        update phases;
    }
}
