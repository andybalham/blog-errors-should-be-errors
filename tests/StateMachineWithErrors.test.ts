/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IntegrationTestClient,
  StepFunctionsTestClient,
} from '@andybalham/cdk-cloud-test-kit';
import { randomUUID } from 'crypto';
import StateMachineTestStack from './StateMachineTestStack';

jest.setTimeout(2 * 60 * 1000);

describe('Run tests against state machine with errors', () => {
  //
  let sut: StepFunctionsTestClient;

  const testClient = new IntegrationTestClient({
    testStackId: StateMachineTestStack.Id,
  });

  beforeAll(async () => {
    await testClient.initialiseClientAsync();
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();
    sut = testClient.getStepFunctionsTestClient(
      StateMachineTestStack.StateMachineWithErrorsId
    );
  });

  test('Flow is as expected', async () => {
    // Arrange
    const input = {
      requestId: randomUUID(),
      body: {
        numberAsString: '123',
      },
    };

    // Act
    await sut.startExecutionAsync(input);

    // Await

    const { observations, timedOut } = await testClient.pollTestAsync({
      until: async (o) => sut.isExecutionFinishedAsync(),
    });

    // Assert

    expect(timedOut).toBeFalsy();
    expect(observations).toBeDefined();
  });
});
