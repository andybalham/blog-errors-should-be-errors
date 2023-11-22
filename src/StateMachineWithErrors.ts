import StateMachineBuilder from '@andybalham/state-machine-builder-v2';
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { JsonPath, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import {
  DynamoAttributeValue,
  DynamoPutItem,
} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export default class StateMachineWithErrors extends Construct {
  //
  readonly stateMachine: StateMachine;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const validatorFunction = new NodejsFunction(this, 'ValidatorFunction', {});

    const stateTable = new Table(this, 'StateTable', {
      partitionKey: { name: 'key', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.stateMachine = new StateMachine(this, 'StateMachine', {
      definition: new StateMachineBuilder()
        // TODO: Create an initial state, then update
        .lambdaInvoke('ValidateInput', {
          lambdaFunction: validatorFunction,
          retryOnServiceExceptions: false,
          inputPath: '$$.Execution.Input.body',
          catches: [
            { errors: ['InvalidFormat'], handler: 'HandleInvalidFormat' },
            { errors: ['InvalidContent'], handler: 'HandleInvalidContent' },
            { errors: ['States.ALL'], handler: 'HandleUnexpectedError' },
          ],
        })
        .perform(
          new DynamoPutItem(this, 'HandleValidRequest', {
            table: stateTable,
            item: {
              key: DynamoAttributeValue.fromString(
                JsonPath.stringAt('$$.Execution.Input.requestId')
              ),
              status: DynamoAttributeValue.fromString('Valid'),
            },
          })
        )
        .end()

        .perform(
          new DynamoPutItem(this, 'HandleInvalidFormat', {
            table: stateTable,
            item: {
              key: DynamoAttributeValue.fromString(
                JsonPath.stringAt('$$.Execution.Input.requestId')
              ),
              status: DynamoAttributeValue.fromString('InvalidFormat'),
            },
          })
        )
        .end()

        .perform(
          new DynamoPutItem(this, 'HandleInvalidContent', {
            table: stateTable,
            item: {
              key: DynamoAttributeValue.fromString(
                JsonPath.stringAt('$$.Execution.Input.requestId')
              ),
              status: DynamoAttributeValue.fromString('InvalidContent'),
            },
          })
        )
        .end()

        .perform(
          new DynamoPutItem(this, 'HandleUnexpectedError', {
            table: stateTable,
            item: {
              key: DynamoAttributeValue.fromString(
                JsonPath.stringAt('$$.Execution.Input.requestId')
              ),
              status: DynamoAttributeValue.fromString('UnexpectedError'),
            },
          })
        )
        .end()

        .build(this),
    });
  }
}
