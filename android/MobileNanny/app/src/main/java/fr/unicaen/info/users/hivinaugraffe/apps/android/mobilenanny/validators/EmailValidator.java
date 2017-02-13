package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.validators;

public final class EmailValidator extends Validator {

    private static final String DEFAULT_REGEX = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}";

    public EmailValidator() {

        this(EmailValidator.DEFAULT_REGEX);
    }
    @SuppressWarnings("WeakerAccess")
    public EmailValidator(String regex) {

        super(regex);
    }
}
