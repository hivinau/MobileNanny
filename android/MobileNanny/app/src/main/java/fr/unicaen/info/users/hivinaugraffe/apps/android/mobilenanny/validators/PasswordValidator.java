package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.validators;

public final class PasswordValidator extends Validator {

    private static final String DEFAULT_REGEX = "[^ ]{8,}";

    public PasswordValidator() {

        this(PasswordValidator.DEFAULT_REGEX);
    }

    @SuppressWarnings("WeakerAccess")
    public PasswordValidator(String regex) {

        super(regex);
    }
}
