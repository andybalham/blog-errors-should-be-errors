/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DynamoDBTestClient,
  IntegrationTestClient,
  StepFunctionsTestClient,
} from '@andybalham/cdk-cloud-test-kit';
import { randomUUID } from 'crypto';
import StateMachineTestStack from './StateMachineTestStack';

jest.setTimeout(2 * 60 * 1000);

describe('Run tests against state machine with outputs', () => {
  //
  let sut: StepFunctionsTestClient;
  let stateTable: DynamoDBTestClient;

  const testClient = new IntegrationTestClient({
    testStackId: StateMachineTestStack.Id,
  });

  beforeAll(async () => {
    await testClient.initialiseClientAsync();
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();
    sut = testClient.getStepFunctionsTestClient(
      StateMachineTestStack.StateMachineWithOutputsId
    );
    stateTable = testClient.getDynamoDBTestClient(
      StateMachineTestStack.StateTableWithOutputsId
    );
  });

  test.each([
    [
      {
        name: "Elias O'Leary",
        age: 34,
        email: 'elias.oleary@andybalham.com',
      },
      'Valid',
    ],
    [
      {
        name: 'Missing property',
        age: 24,
      },
      'InvalidFormat',
    ],
    [
      {
        name: 'Too Young',
        age: 10,
        email: 'youngun@andybalham.com',
      },
      'InvalidContent',
    ],
  ])('%o has expected status of %s', async (body, expectedStatus) => {
    //
    // Arrange
    const input = {
      requestId: randomUUID(),
      body,
    };

    // Act
    await sut.startExecutionAsync(input);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () =>
        !!(await stateTable.getItemAsync({ key: input.requestId })),
    });

    const requestItem: any = await stateTable.getItemAsync({
      key: input.requestId,
    });

    // Assert

    expect(timedOut).toBeFalsy();
    expect(requestItem.status).toBe(expectedStatus);
  });
});
