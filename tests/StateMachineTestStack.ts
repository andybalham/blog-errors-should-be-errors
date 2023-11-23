/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { Construct } from 'constructs';
import StateMachineWithErrors from '../src/StateMachineWithErrors';

export default class StateMachineTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'Blog-ErrorsShouldBeErrors';

  static readonly StateMachineWithErrorsId = 'StateMachineWithErrorsId';

  static readonly StateTableWithErrorsId = 'StateTableWithErrorsId';

  static readonly EventObserverId = 'EventObserverId';

  constructor(scope: Construct, id: string) {
    super(scope, id, {
      testStackId: StateMachineTestStack.Id,
      testFunctionIds: [StateMachineTestStack.EventObserverId],
    });

    // SUT

    const stateMachineWithErrors = new StateMachineWithErrors(
      this,
      'StateMachineWithErrors'
    );

    // Tag resources for testing

    this.addTestResourceTag(
      stateMachineWithErrors.stateMachine,
      StateMachineTestStack.StateMachineWithErrorsId
    );

    this.addTestResourceTag(
      stateMachineWithErrors.stateTable,
      StateMachineTestStack.StateTableWithErrorsId
    );
  }
}
