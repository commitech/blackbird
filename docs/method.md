# Methods

## Duty

### duty/get_duty

Parameter :

`id` : Integer.

Returns a duty object `return` that has the property `return.id = id`



### duty/can_grab_duty

`user` : User object. Required parameter : `id`

`specific_duty` : Specific Duty object. Required parameter : `duty_id`, `day`, `month`, `year`

Returns a boolean, whether the user can grab the duty specified. If the `user` is not a Subcom, then it will always return `true`.



### duty/grab_duty

Parameter :

`user` : User object. Required parameter : `id`

`specific_duty` : Specific Duty object. Required parameter : `duty_id`, `day`, `month`, `year`

`grab_restriction_bypass` : Boolean. True if grab restriction will be ignored

*Authorization : This method must only be called by admin or a non-admin the user that is specified. Call from other user will result in a Unauthorized Access error. If the caller is the non-admin specified user, then the `grab_restriction_bypass` will be ignored and will be set to false*



### duty/grab_duties

Parameter :

`user` : User object. Required parameter : `id`

`specific_duties` : Array of specific duty objects. Required parameter on each of the specific duty object : `duty_id`, `day`, `month`, `year`

`grab_restriction_bypass` : Boolean. True if grab restriction will be ignored

*Authorization : This method must only be called by admin or a non-admin the user that is specified. Call from other user will result in a Unauthorized Access error. If the caller is the non-admin specified user, then the `grab_restriction_bypass` will be ignored and will be set to false*



### duty/release_duty

Parameter :

`user` : User object. Required parameter : `id`

`specific_duty` : Specific duty object. Required parameter : `duty_id`, `day`, `month`, `year`

*Authorization : This method must only be called by admin or a non-admin the user that is specified. Call from other user will result in a Unauthorized Access error.*



### duty/release_duties

Parameter : 

`user` : User object. Required parameter : `id`

`specific_duties` : Array of specific duty objects. Required parameter on each of the specific duty object : `duty_id`, `day`, `month`, `year`

*Authorization : This method must only be called by admin or a non-admin the user that is specified. Call from other user will result in a Unauthorized Access error.*



### duty/assign_permanent_duty

Parameter : 

`user` : User object. Required parameter : `id`

`duty` : Duty object. Required parameter : `id`,

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*



### duty/assign_permanent_duties

Parameter : 

`user` : User object. Required parameter : `id`

`duties` : Array of duty objects. Required parameter on the duty object : `id`

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*



### duty/assign_temporary_duty

Parameter : 

`user` : User object. Required parameter : `id`

`specific_duty` : Specific Duty object. Required parameter : `duty_id`, `day`, `month`, `year`

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*



### duty/assign_temporary_duties

Parameter : 

`user` : User object. Required parameter : `id`

`specific_duties` : Array of specific duty objects. Required parameter on each of the specific duty object : `duty_id`, `day`, `month`, `year`

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*



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

`id` : Integer.

Returns the user object `return` that has the property `return.id = id`




### user/add_user

Parameter :

`user` : User object. Required parameter : `name`, `matric_number`, `contact`, `email`, `cell`, `position`

`password` : String. The unhashed password for the user.

Returns the `id` of the new user. 

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*




### user/remove_user

Parameter :

`user` : User object. Required parameter : `id`

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*




### user/edit_user

Parameter :

`user` : User object. Required parameter : `id`. Optional parameter (only those parameter to change) : `name`, `matric_number`, `contact`, `email`, `cell`, `position`, `is_noitifcation`, `status`, `is_admin`, `tracking`, `is_duty` 

*Authorization : This method must only be called by admin or a non-admin the user that is specified. Call from other user will result in a Unauthorized Access error.

If the caller is admin, then all parameter of the user object is considered. If the caller is the non-admin user, then only `contact` and `email` will be considered, since the user can't change it's `status`, for example.*




### user/edit_password

`user` : User object. Required parameter : `id`

`password` : String. New password

**IMPORTANT : This API must be called using POST request, as it consist password**

*Authorization : This method must only be called by admin or the user that is specified. Call from other user will result in a Unauthorized Access error.*




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










## Announcement

### announcement/get_announcement

Parameter :

`id` : Integer.

Returns an announcement object `return` that has the property `return.id = id`




### announcement/get_all_announcement

No parameter

Returns an array of announcement objects of all announcements




### announcement/add_announcement

Parameter :

`announcement` : Announcement object. Required parameter : `title`, `content`.

Returns the `id` of the new announcement.




### announcement/edit_announcement

Parameter :

`announcement` : Announcement object. Required parameter : `id`. Optional parameter (only those parameter to change) : `title`, `content`.

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*



### announcement/remove_announcement

Parameter :

`announcement` : Announcement object. Required parameter : `id`

*Authorization : This method must only be called by admin. Call from a non-admin will result in a Unauthorized Access error.*










## Sign

### sign/get_sign

Parameter :

`id` : Integer.

Returns a sign object `return` that has the property `return.id = id`




### sign/get_all_sign

No parameter

Returns an array of sign objects of all signs




### sign/add_sign

Parameter :

`sign` : Sign object. Required parameter : `supervisor_id`, `location`, `sign_type`.

Returns the `id` of the new sign.


