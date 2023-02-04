import mitt from 'mitt'

type Event = {
    [name : string] : Object
}
declare type Handler<T = Object> = (event?: T) => void;

export default mitt<Event>();
export type { Event, Handler }