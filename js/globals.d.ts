interface Place {
    title: string;
    excerpt: string;
    permalink: string;
    featured_image: string | null;
    lat: number;
    lng: number;
}

interface StoryMapboxSettings {
    ajax_url: string;
    mapbox_token: string;
}

interface UchAdminMap {
    token: string;
    lat: string;
    lng: string;
    hasPin: boolean;
}

declare const storyMapboxSettings: StoryMapboxSettings;
declare const uchAdminMap: UchAdminMap;
