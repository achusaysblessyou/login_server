require 'spec_helper'

describe User do
  before(:each) do
  	@user = User.new()
  end

  after(:each) do
    User.delete_all
  end

  it "should be valid with validUsername validPassword and validCount" do
  	@user.user = "validUsername"
  	@user.password = "validPassword"
  	validCount = 1
  	@user.count = validCount
  	@user.should be_valid
  end

  it "should not be valid with empty user" do
    @user.count = 1
    @user.password = "validPassword"
  	@user.user = ''
  	@user.user.length.should == 0
  	@user.should_not be_valid
  end

  it "should not be valid with user longer than 128" do
  	@user.password = "validPassword"
  	@user.count = 1
  	longString = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
  	@user.user = longString
  	longString.length.should == 129
  	@user.should_not be_valid
  end

  it "should not be valid if it shares user with another user" do
  	@user.password = "validPassword"
  	@user.count = 1
  	@userTwo = User.new(:user => "username", :password => "password2", :count => 2).save
  	@user.user = "username"
  	@user.should_not be_valid
  end

  it "should be valid with user longer than than or equal to 128" do
  	@user.password = "validPassword"
  	@user.count = 1
  	notSoLongString = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678"
  	@user.user = notSoLongString
  	notSoLongString.length.should == 128
  	@user.should be_valid
  end

  it "should not be valid with password longer than 128" do
  	@user.user = "validUsername"
  	@user.count = 1
  	longString = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
  	@user.password = longString
  	longString.length.should == 129
  	@user.should_not be_valid
  end

  it "should be valid with password less than equal to 128 chars" do
    @user.user = "validUsername"
    @user.count = 1
  	notSoLongString = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678"
    notSoLongString.length.should == 128
    @user.password
  end

  it "should be valid if password is empty" do
  	@user.user = "validUsername"
  	@user.count = 1
  	@user.password = ""
  	@user.password.length.should == 0
  	@user.should be_valid
  end

  it "should be able to share passwords (but not recommended)" do
  	@userTwo = User.new(:user => "userTwo", :password => "genericPassword", :count => 2).save
  	@user.user = "userOne"
  	@user.password = "genericPassword"
  	@user.count = 1
  	@user.should be_valid
  end 

  it "should not be able to have negative count" do
  	@user.user = "validUsername"
  	@user.password = "validPassword"
  	@user.count = -1
  	@user.should_not be_valid
  end

  it "should be able to have zero count" do
  	@user.user = "validUsername"
  	@user.password = "validPassword"
  	@user.count = 0
  	@user.should be_valid
  end

  it "should be able to have positive count" do
  	@user.user = "validUsername"
  	@user.password = "validPassword"
  	@user.count = 5000000
  	@user.should be_valid
  end

end