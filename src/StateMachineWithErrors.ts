import StateMachineBuilder from '@andybalham/state-machine-builder-v2';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';

export default class StateMachineWithErrors extends Construct {
  //
  readonly stateMachine: StateMachine;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.stateMachine = new StateMachine(this, 'StateMachine', {
      definition: new StateMachineBuilder().pass('Dummy').build(this),
    });
  }
}
