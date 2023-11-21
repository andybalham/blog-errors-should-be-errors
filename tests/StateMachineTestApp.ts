/* eslint-disable no-new */
import * as cdk from 'aws-cdk-lib';
import StateMachineTestStack from './StateMachineTestStack';

const app = new cdk.App();
cdk.Tags.of(app).add('app', 'StateMachineTest');

new StateMachineTestStack(app, StateMachineTestStack.Id);
