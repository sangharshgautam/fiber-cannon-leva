export interface LightConfig {
    type: 'Directional' | 'Point' | 'Hemisphere' | 'Ambient';
    position: [number, number, number];
    args: string;
}
