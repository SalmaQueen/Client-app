import userService from "./user-service";
import ActionCable from 'actioncable'

const consumer = () => {
  return ActionCable.createConsumer(`ws://localhost:3000/cable?token=${userService.token()}`);
}

export const HelpChannel = () => {
  try {
    return consumer.subscriptions.create({channel: 'HelpChannel'}, {
      received: () => console.log('Received info from help')
    })
  } catch (error) {
    console.log('Action cable service: ', error);
  }
  
}

export default consumer;