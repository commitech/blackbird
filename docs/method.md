# Methods

## Duty

### duty/get_duty

Parameter :

`id` : Integer.

Returns a duty object `return` that has the property `return.id = id`

### duty/grab_duty

Parameter :

`user` : User object. Required parameter : `id`

`specific_duty` : Specific Duty object. Required parameter : `duty_id`, `day`, `month`, `year`

`grab_restriction` : Boolean. True if grab is restricted with duty grab rules.

### duty/grab_duties

Parameter :

`user` : User object. Required parameter : `id`

`specific_duties` : Array of specific duty objects. Required parameter on each of the specific duty object : `duty_id`, `day`, `month`, `year`

`grab_restriction` : Boolean. True if grab is restricted with duty grab rules.

### duty/release_duty

Parameter :

`user` : User object. Required parameter : `id`

`specific_duty` : Specific duty object. Required parameter : `duty_id`, `day`, `month`, `year`

### duty/release_duties

Parameter : 

`user` : User object. Required parameter : `id`

`specific_duties` : Array of specific duty objects. Required parameter on each of the specific duty object : `duty_id`, `day`, `month`, `year`

### duty/assign_permanent_duty

Parameter : 

`user` : User object. Required parameter : `id`

`duty` : Duty object. Required parameter : `id`,

### duty/assign_permanent_duties

Parameter : 

`user` : User object. Required parameter : `id`

`duties` : Array of duty objects. Required parameter on the duty object : `id`

### duty/assign_temporary_duty

Parameter : 

`user` : User object. Required parameter : `id`

`specific_duty` : Specific Duty object. Required parameter : `duty_id`, `day`, `month`, `year`

### duty/assign_temporary_duties

Parameter : 

`user` : User object. Required parameter : `id`

`specific_duties` : Array of specific duty objects. Required parameter on each of the specific duty object : `duty_id`, `day`, `month`, `year`

### duty/get_supervisor_id

Parameter : 

`specific_duty` : Specific Duty object. Required parameter : `duty_id`, `day`, `month`, `year`

Returns the supervisor ID that is creleasedurrently dutying on `specific_duty `. The result will be an object consisting of `supervisor_id` and `is_free`. `is_free` is a boolean indicating whether a duty is free or not. If it is, `supervisor_id` is the ID of the supervisor who releases that duty.

### duty/get_duty_schedule

Parameter : 

`day` : Integer.

`month` : Integer.

`year` : Integer.

Returns the array of supervisor ID which duties on the parameter day, sorted from the earliest to latest. Each element in the array is an object consisting of `duty_id`, `supervisor_id`, and `is_free`.

### duty/get_original_duty_schedule

Parameter : 

`day_name` : String.

Returns the array of supervisor ID which originally (not after grab/release) duties on the parameter day, sorted from the earlist to latest. Each element in the array is an object consisting of `duty_id`, `supervisor_id`.

### duty/get_free_duties

Parameter : 

`day` : Integer.

`month` : Integer.

`year` : Integer.

`location` : String.

Returns the array of `duty_id` that is free (released but not grabbed yet) duties on the parameter day. 

### duty/get_all_free_duties

No parameter.

Returns the array of `specific_duty` that is free (released but not grabbed yet) duties. 





## User

### user/me

No parameter

Returns the user object that is currently logged in.

### user/get_user

Parameter :

`user` : User object. Requried parameter : `id`

Returns the user object `return` that has the property `return.id = user.id`

### user/add_user

Parameter :

`user` : User object. Required parameter : `name`, `matric_number`, `contact`, `email`, `cell`, `position`

`password` : String. The unhashed password for the user.

### user/remove_user

Parameter :

`user` : User object. Required parameter : `id`

### user/edit_user

Parameter :

`user` : User object. Required parameter : `id`. Optional parameter (only those parameter to change) : `name`, `matric_number`, `contact`, `email`, `cell`, `position`, `is_noitifcation`, `status`, `is_admin`, `tracking`, `is_duty` 

### user/edit_password

`user` : User object. Required parameter : `id`

`password` : String. New password

### user/get_all_users

No parameter

Returns an array of user objects of all users

### user/get_notify_users

No parameter

Returns an array of user objects `user` that has property `user.is_notification = true`.

### user/get_eod_users

No parameter

Returns an array of user objects `user` that subscribes to EOD. Currently, they are users that has propery `user.position = 'Center and Ops'`.

### user/login

**IMPORTANT : This API must be called using POST request, as it consist password**

Parameter :

`username` : String.

`password` : String.

### user/logout

No parameter
