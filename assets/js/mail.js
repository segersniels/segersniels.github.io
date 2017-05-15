$(document).ready(function() {
    // process the form
    $('form').submit(function(event) {
        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'email'             : $('input[name=email]').val(),
            'subject'           : $('input[name=subject]').val(),
            'text'              : $('input[name=message]').val()
        };

        $.ajax({
            url: 'https://veuwyhpsk9.execute-api.eu-west-1.amazonaws.com/dev/mail/post',
            type: 'POST',
            crossDomain: true,
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function(data) {
                window.location.href = "http://nielssegers.com/thanks";
            },
            error: function(xhr, ajaxOptions, thrownError) {
                //error handling stuff
            }
        })
            // using the done promise callback
            .done(function(data) {

                // log data to the console so we can see
                console.log(data); 

                // here we will handle errors and validation messages
            });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

});
