export type TListener<T extends object> = (arsg: T) => any;
export type TEventReturn<T = any> = T;
/**
 * Parent station
 */
export declare class Station<TState extends {}, TEvents extends {
    [key: string]: TEventReturn;
} = {}> {
    private readonly _listeners;
    private readonly _eventListeners;
    protected state: TState;
    /**
     * Subcribe station by listener(s)
     * @param args
     */
    subscribe(args: Required<{
        listeners: TListener<TState> | Array<TListener<TState>>;
    }>): void;
    /**
     * Unsubcribe station on specific listenter(s)
     * @param args
     */
    unsubscribe(args: Required<{
        listeners: TListener<TState> | Array<TListener<TState>>;
    }>): void;
    /**
     *
     * @param args
     */
    subscribeOnEvent<TEventName extends keyof TEvents>(args: Required<{
        eventName: TEventName;
        listeners: (args: TEvents[TEventName]) => any | Promise<any> | Array<(args: TEvents[TEventName]) => any | Promise<any>>;
    }>): void;
    /**
     * Subcribe on customize event
     * @param args
     */
    unsubscribeOnEvent<TEventName extends keyof TEvents>(args: Required<{
        eventName: TEventName;
        listeners: (args: TEvents[TEventName]) => any | Promise<any> | Array<(args: TEvents[TEventName]) => any | Promise<any>>;
    }>): void;
    /**
     * Update state and emit new state changes to listening React component(s)
     * @param args
     */
    protected setState(args: TState): void;
    /**
     *
     * @param args
     * @returns
     */
    protected dispatch<TEventName extends keyof TEvents>(args: Required<{
        eventName: TEventName;
        data: TEvents[TEventName];
    }>): void;
    /**
     * @deprecated
     */
    get $state(): TState;
}
