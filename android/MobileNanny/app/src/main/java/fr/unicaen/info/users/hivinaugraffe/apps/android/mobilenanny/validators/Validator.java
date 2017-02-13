package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.validators;

import java.util.regex.*;

public abstract class Validator implements IValidator {

    protected Pattern pattern;

    public Validator(String regex) {

        this.pattern = Pattern.compile(regex);
    }
    @Override
    public boolean validate(String content) {

        Matcher matcher = pattern.matcher(content);

        return matcher.matches();
    }
}