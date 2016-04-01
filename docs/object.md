# Object types

## User

Represents each user in the community.

`id` : Integer. The ID of a user. This is a positive integer.

`name` : String.

`matric_number` : String.

`contact` : String.

`email` : String.

`cell` : String.

`position` : String.

`is_notification` : Boolean. If true, then the user is subscribed to notification.

`status` : Boolean. If true, then the user is activated (allowed to login)

`is_admin` : Boolean. If true, then the user have admin access panel.

`tracking` : String. Money tracking status. Either "treasurer", "comcen", or "none"

`is_duty` : Boolean. If true, then the user is allowed to have duty.

## Duty

Represents a duty.

`id` : Integer. The ID of a duty. A duty which have the same day AND the same timing have the same ID.

`day_name` : String. The day of the week of the duty. It will be either `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, or `Saturday`.

`start_time` : String. hh:mm:ss format.

`end_time` : String. hh:mm:ss format.

`location` : String. Either "yih" or "cl".

## Specific Duty

Represents a duty at a certain day.

`duty_id` : The ID of the duty, corresponds to the duty ID above.

`day` : Integer.

`month` : Integer.

`year` : Integer.

## Sign

`id` : Integer. The ID of a sign.

`supervisor_id` : The supervisor ID who made that sign.

`location` : String. Either "yih" or "cl".

`sign_type` : String. Either "in" or "out".

`time` : String. YYYY-MM-DD hh:mm:ss format.

## Announcement

`id` : Integer. The ID of an announcement

`title` : String.

`content` : Content.

`time` : String. YYYY-MM-DD hh:mm:ss format.

## Tracking

Represents a money tracking

`id` : Integer. The ID of a tracking

`month` : Integer

`year` : Integer

`index` : Integer. The index of the step. Starts from 1

`treasurer_status` : String. Either "pending", "completed", or "not required"

`comcen_status` : String. Either "pending", "completed", or "not required"
