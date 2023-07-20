interface Atom<AtomType> {
    get: () => AtomType;
    set: (newValue: AtomType) => void;
    subscribe: (callback: (newValue: AtomType) => void) => () => void;
    _subscribers: () => number;
}
type AtomGetter<AtomType> = (get: <Target>(a: Atom<Target>) => Target) => AtomType;
type AtomSetter<AtomType> = (newValue: AtomType) => void;
export declare function atom<AtomType>(initialValue: AtomType | AtomGetter<AtomType>): Atom<AtomType>;
type useAtomType<T, G = any> = [T, AtomSetter<G>];
export declare function useAtom<AtomType>(atom: Atom<AtomType>): useAtomType<AtomType>;
export declare function useAtomValue<AtomType>(atom: Atom<AtomType>): AtomType;
export {};
