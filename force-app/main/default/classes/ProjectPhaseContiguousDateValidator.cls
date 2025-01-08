/**
 * Helper class to validate that all dates within a project's phases are contiguous
 */
public with sharing class ProjectPhaseContiguousDateValidator {
    private List<Project__c> projects;

    public void setRelatedData(List<Project__c> projects) {
        this.projects = projects;
    }

    public void validate(List<Project_Phase__c> projectPhases) {
        if (this.projects == null) {
            throw new RelatedDataNotSetException(
                'Related data must be set before calling validate()'
            );
        }

        for (Project__c project : this.projects) {
            if (arePhasesContiguous(project)) {
                continue;
            }
            List<Project_Phase__c> relatedPhases = getRelatedPhases(projectPhases, project.Id);
            for (Project_Phase__c relatedPhase : relatedPhases) {
                relatedPhase.addError('Phase dates within a project must be contiguous');
            }
        }
    }

    private Boolean arePhasesContiguous(Project__c project) {
        List<Project_Phase__c> projectPhases = project.Project_Phases__r;
        if (projectPhases.size() <= 1) {
            return true;
        }
        Project_Phase__c previousPhase = projectPhases[0];
        for (Integer i = 1; i < projectPhases.size() - 1; i++) {
            Project_Phase__c currentPhase = projectPhases[i];
            Date expectedStartDate = previousPhase.End_Date__c.addDays(1);
            if (currentPhase.Start_Date__c != expectedStartDate) {
                return false;
            }
            previousPhase = currentPhase;
        }

        return true;
    }

    private List<Project_Phase__c> getRelatedPhases(
        List<Project_Phase__c> projectPhases,
        Id projectId
    ) {
        List<Project_Phase__c> relatedPhases = new List<Project_Phase__c>();
        for (Project_Phase__c projectPhase : projectPhases) {
            if (projectPhase.Project__c == projectId) {
                relatedPhases.add(projectPhase);
            }
        }
        return relatedPhases;
    }
}
