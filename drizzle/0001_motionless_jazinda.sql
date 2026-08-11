ALTER TABLE "restaurant_settings" ADD COLUMN "background_color" varchar(20) DEFAULT '#080a0b' NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurant_settings" ADD COLUMN "surface_color" varchar(20) DEFAULT '#12151d' NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurant_settings" ADD COLUMN "text_color" varchar(20) DEFAULT '#f7f8f6' NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurant_settings" ADD COLUMN "corner_radius" integer DEFAULT 18 NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurant_settings" ADD COLUMN "hero_image_url" text;