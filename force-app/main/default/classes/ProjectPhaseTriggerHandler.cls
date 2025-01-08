public class ProjectPhaseTriggerHandler extends TriggerHandler {
    public override void afterUpdate() {
        List<Project__c> projects = getProjectsAndPhases(
            pluckProjectIds((List<Project_Phase__c>) Trigger.new)
        );
        ProjectPhaseContiguousDateValidator validator = new ProjectPhaseContiguousDateValidator();
        validator.setRelatedData(projects);
        validator.validate((List<Project_Phase__c>) Trigger.new);
    }

    private Set<Id> pluckProjectIds(List<Project_Phase__c> projectPhases) {
        Set<Id> projectIds = new Set<Id>();
        for (Project_Phase__c projectPhase : projectPhases) {
            projectIds.add(projectPhase.Project__c);
        }
        return projectIds;
    }

    private List<Project__c> getProjectsAndPhases(Set<Id> projectIds) {
        List<Project__c> projects = [
            SELECT
                Name,
                (
                    SELECT Name, Start_Date__c, End_Date__c
                    FROM Project_Phases__r
                    ORDER BY Start_Date__c
                )
            FROM Project__c
            WHERE Id IN :projectIds
        ];
        return projects;
    }
}
