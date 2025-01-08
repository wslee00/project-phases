@IsTest
private class ProjectPhasesEditorControllerTest {
    @IsTest
    static void should_get_project_phases() {
        Project__c project = new Project__c(Name = 'Test Project');
        insert project;

        List<Project_Phase__c> phases = new List<Project_Phase__c>{
            new Project_Phase__c(
                Project__c = project.Id,
                Name = 'Phase 1',
                Start_Date__c = Date.today(),
                End_Date__c = Date.today().addDays(9)
            ),
            new Project_Phase__c(
                Project__c = project.Id,
                Name = 'Phase 2',
                Start_Date__c = Date.today().addDays(10),
                End_Date__c = Date.today().addDays(19)
            )
        };
        insert phases;

        Test.startTest();
        List<Project_Phase__c> phasesFromController = ProjectPhasesEditorController.getProjectPhases(
            project.Id
        );
        Test.stopTest();

        Assert.areEqual(2, phasesFromController.size());
        Assert.areEqual('Phase 1', phasesFromController[0].Name);
        Assert.areEqual('Phase 2', phasesFromController[1].Name);
    }
}
